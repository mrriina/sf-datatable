public without sharing class AccountCasesPdfCtrl {
    public List<Case> cases{get;set;}
    
    public AccountCasesPdfCtrl(){
        this.cases = this.getAccountCasesPrevWeek();
    }
	public List<Case> getAccountCasesPrevWeek() {
        Date startOfPreviousWeek = Date.today().toStartOfWeek().addDays(-7);
        Date endOfPreviousWeek = startOfPreviousWeek.addDays(6);
        
        return [SELECT Account.Name, Account.Owner.Name, CaseNumber, Status, Priority, Origin
                FROM Case
                WHERE CreatedDate >= :startOfPreviousWeek AND CreatedDate <= :endOfPreviousWeek
                ORDER BY Account.Name
               ];
    }
}