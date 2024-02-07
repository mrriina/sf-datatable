@isTest
public with sharing class ServiceCaseQueueServiceTest {
    public static List<Case> testListCases = new List<Case>();
    public static Group testQueue = new Group();

    static {
        testListCases = TestFactory.insertReturnCases();
        testQueue = TestFactory.insertReturnGroup();
    }
    
    @isTest 
    public static void testGetUserCases() {
        Test.startTest();
        List<Case> casesList = ServiceCaseQueueService.getUserCases();
        Test.stopTest();
        System.assert(casesList != null);
    }

    @isTest 
    public static void testGetUserQueues() {
        Test.startTest();
        Set<Id> queueIds = ServiceCaseQueueService.getUserQueues();
        Test.stopTest();
        System.assert(queueIds.contains(testQueue.Id)); 
    }
}