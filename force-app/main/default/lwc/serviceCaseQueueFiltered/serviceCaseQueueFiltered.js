import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import getUserCases from '@salesforce/apex/ServiceCaseQueueService.getUserCases';
import getCaseStatusOptions from '@salesforce/apex/ServiceCaseQueueService.getCaseStatusOptions';


export default class ServiceCaseQueueFiltered extends NavigationMixin(LightningElement) {
    @track cases = [];
    statusOptions = [];
    isLoading = false;
    columns = [
        {label: 'Case Number', fieldName: 'CaseNumberUrl', type: 'url', typeAttributes: {label: { fieldName: 'CaseNumber' }, target: '_blank'}},
        { label: 'Assignee', fieldName: 'OwnerId', type: 'text', sortable: true },
        { label: 'Case Status', fieldName: 'Status', type: 'dropdown', editable: true, typeAttributes: { options: '$statusOptions' } },
        { label: 'Priority', fieldName: 'Priority', type: 'text', sortable: true },
        { label: 'Origin', fieldName: 'Origin', type: 'text', sortable: true },

    ];


    wiredCases;
    @wire(getUserCases)
    wiredGetUserCases(wireResult){ 
        const { data, error } = wireResult;
        this.wiredCases = wireResult;
        if(data){
            this.cases = data.map(record => ({
                ...record,
                CaseNumberUrl: `/${record.Id}`,
            }));
        }
        if(error){ 
            console.log(error)
        }
    }

    @wire(getCaseStatusOptions)
    wiredGetStatusOptions({data, error}){ 
        if(data){ 
            this.statusOptions = data;
        }
        if(error){ 
            console.log(error)
        }
    }


    handleCellChange(event) {
        console.log('event.detail=', event.detail);
        
    }


    handleRefresh() {
        this.isLoading = true;
        
        refreshApex(this.wiredCases).finally(() => {
            this.isLoading = false;
        });
    }
}