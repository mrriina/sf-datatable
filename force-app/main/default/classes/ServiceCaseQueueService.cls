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
}