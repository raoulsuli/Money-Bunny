export class BankAccount {
	constructor(
		public iban: string,
		public pin: string,
		public sold: number,
		public accountType: string,
		public dateOpened: Date,
		public blocked: boolean,
		public coin: string,
		//public bankId: string,
		//public userId: string,
		public accountId?: string // to be completed by firebase
	) {};
}
