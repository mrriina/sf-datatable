@isTest
public without sharing class AccountCasesPdfCtrlTest {
    public static List<Case> testListCases = new List<Case>();

    static {
        testListCases = TestFactory.insertReturnLastWeekCases();
    }

    @isTest 
    public static void testGetAccountCasesPrevWeek() {
        AccountCasesPdfCtrl controller = new AccountCasesPdfCtrl();
        Test.startTest();
        List<Case> casesList = controller.cases;
        Test.stopTest();
        System.assertEquals(1, casesList.size());   
    }
}