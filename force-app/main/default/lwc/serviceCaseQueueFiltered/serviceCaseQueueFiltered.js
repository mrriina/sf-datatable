import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import getUserCases from '@salesforce/apex/ServiceCaseQueueService.getUserCases';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';

import CASE_OBJECT from '@salesforce/schema/Case';
import STATUS_FIELD from "@salesforce/schema/Case.Status";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import { getObjectInfo } from "lightning/uiObjectInfoApi";


export default class ServiceCaseQueueFiltered extends NavigationMixin(LightningElement) {
    @track cases = [];
    statusOptions = [];
    isLoading = false;
    defaultRecordTypeId;

    columns = [
        {label: 'Case Number', fieldName: 'CaseNumberUrl', type: 'url', typeAttributes: {label: { fieldName: 'CaseNumber' }, target: '_blank'}},
        { label: 'Assignee', fieldName: 'OwnerId', type: 'text', sortable: true },
        { label: 'Priority', fieldName: 'Priority', type: 'text', sortable: true },
        { label: 'Origin', fieldName: 'Origin', type: 'text', sortable: true },

    ];


    @wire(getObjectInfo, { objectApiName: CASE_OBJECT })
    getCaseInfo({data, error}) {
        if (data) {
            this.defaultRecordTypeId = data.defaultRecordTypeId;
        }
        else if (error) {
            console.log(error);        
        }
    };

    @wire(getPicklistValues, { recordTypeId: '$defaultRecordTypeId', fieldApiName: STATUS_FIELD })
    wiredGetStatusOptions({data, error}){ 
            if(data){
                this.statusOptions = data.values;
                
                this.columns = [
                    ...this.columns.slice(0, 2),
                    {
                        label: 'Case Status',
                        fieldName: 'Status',
                        type: 'picklist',
                        editable: false,
                        typeAttributes: {
                            placeholder: 'Choose Status',
                            options: this.statusOptions,
                            value: { fieldName: 'Status' },
                            context: { fieldName: 'Id' },
                            variant: 'label-hidden',
                            name: 'Status',
                            label: 'Case Status'
                        }
                    },
                    ...this.columns.slice(2)
                ];                
            }
            if(error){
                console.log(error)
            }
        }


    wiredCases;
    @wire(getUserCases)
    wiredGetUserCases(wireResult){ 
        const { data, error } = wireResult;
        this.wiredCases = wireResult;
        this.isLoading = true;
        if(data){
            this.cases = data.map(record => ({
                ...record,
                CaseNumberUrl: `/${record.Id}`,
            }));
        }
        if(error){ 
            console.log(error)
        }
        this.isLoading = false;
    }
    

    handleValueChange(event) {
        const updatedCaseRecord = {
            fields: {
                Id: event.detail.data.context,
                Status: event.detail.data.value
            }
        };

        updateRecord(updatedCaseRecord)
            .then(() => {
                this.showToast('Success', 'Record updated successfully', 'success');
                this.handleRefresh();
            })
            .catch(error => {
                this.showToast('Error updating record', error.body.message, 'error');
            })
    }


    handleRefresh() {
        this.isLoading = true;
        
        refreshApex(this.wiredCases).finally(() => {
            this.isLoading = false;
        });
    }

    showToast(title, message, variant){
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant
            })
        );
    }
}