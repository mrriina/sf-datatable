@isTest
public with sharing class TestFactory {
    
    public static List<Case> insertReturnCases(){
        List<Case> testListCases = returnCases();
        insert testListCases;
        
        return testListCases;
    }

    public static List<Case> returnCases(){
        List<Case> testListCases = new List<Case>();
        for(Integer i=0; i<2; i++){
            Case cs = new Case(
                Status = 'New',
                Origin = 'Phone'
            );
            testListCases.add(cs);
        }
        
        return testListCases;
    }

    public static List<Case> insertReturnLastWeekCases(){
        List<Case> testCases = returnCases();
        insert testCases;
        Test.setCreatedDate(testCases[0].Id, Datetime.now().addDays(-8));
        
        return testCases;
    }

    public static Group insertReturnGroup(){
        Group testQueue = returnGroup();
        insert testQueue;
        GroupMember testGroupMember = returnGroupMember(testQueue);
        System.runAs( new User(Id = UserInfo.getUserId()) ) {
            insert testGroupMember;
        }
        
        return testQueue;
    }

    public static Group returnGroup(){
        Group testQueue = new Group(
            Name = 'Queue1', 
            Type = 'Queue'
        );

        return testQueue;
    }

    public static GroupMember returnGroupMember(Group testQueue){
        Id testUserId = UserInfo.getUserId();
        GroupMember testGroupMember = new GroupMember(
            UserOrGroupId = testUserId, 
            GroupId = testQueue.Id
        );

        return testGroupMember;
    }
}