public with sharing class ServiceCaseQueueService {
    
    @AuraEnabled(cacheable=true)
    public static List<Case> getUserCases() {
        
        return [
            SELECT Id, CaseNumber, Status, Owner.Name, Priority, CreatedDate, Origin, OwnerId
            FROM Case
            WHERE OwnerId = :UserInfo.getUserId()
            ORDER BY Owner.Name, Priority DESC, CreatedDate DESC
            LIMIT 25
        ];
    }


    @AuraEnabled(cacheable=true)
    public static List<String> getCaseStatusOptions() {
        List<String> statusOptions= new List<String>();
        try {
            Schema.DescribeFieldResult fieldResult = Case.Status.getDescribe();
            List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
		    for(Schema.PicklistEntry pickListVal : ple){
			    statusOptions.add(pickListVal.getLabel());
		    } 

        } catch (Exception e) {
            System.debug('Error: ' + e.getMessage());
        }

        return statusOptions;
    }

    
}