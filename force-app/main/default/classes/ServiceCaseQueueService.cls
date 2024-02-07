public with sharing class ServiceCaseQueueService {
    
    @AuraEnabled(cacheable=true)
    public static List<Case> getUserCases() {
        return [
            SELECT Id, CaseNumber, Status, Priority, CreatedDate, Origin, OwnerId, OwnerName__c
            FROM Case
            WHERE OwnerId IN :getUserQueues() OR OwnerId = :UserInfo.getUserId() 
            ORDER BY Owner.Name, Priority ASC, CreatedDate DESC
            LIMIT 25
        ];
    }

    public static Set<Id> getUserQueues() {
        Set<Id> queueIds = new Set<Id>();
        for (GroupMember member : [
            SELECT GroupId 
            FROM GroupMember 
            WHERE UserOrGroupId = :UserInfo.getUserId()
        ]) {
            queueIds.add(member.GroupId);
        }

        return queueIds;
    }
}