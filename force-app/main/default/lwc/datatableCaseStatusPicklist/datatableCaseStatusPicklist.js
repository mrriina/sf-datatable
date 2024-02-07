import { LightningElement, api } from 'lwc';

export default class DatatableCaseStatusPicklist extends LightningElement {
    @api label;
    @api placeholder;
    @api options;
    @api value;
    @api context;
    @api variant;
    @api name;

    showPicklist = false;

    dispatchCustomEvent(eventName, context, value, label, name) {
        this.dispatchEvent(new CustomEvent(eventName, {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: {
                data: { context: context, value: value, label: label, name: name }
            }
        }));
    }

    handleChange(event) {
        event.preventDefault();
        this.value = event.detail.value;
        this.showPicklist = false;
        this.dispatchCustomEvent('valuechange', this.context, this.value, this.label, this.name);
    }

    handleClick(event) {
        this.showPicklist = true;
    }

    handleBlur(event) {
        event.preventDefault();
        this.showPicklist = false;
    }
}