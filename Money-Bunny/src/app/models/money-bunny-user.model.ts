export class MoneyBunnyUser {
	constructor(
		public name: string,
		public username: string,
		public password: string,
		public email: string,
		public cnp: string, // so it can be empty and pkaceholder from register can be displayed
		public phone: string,
		public birthday: Date,
		public address: string,
		public userType: string,
		public companyName?: string // optional
	) {};
}
