import { AngularFirestoreDocument } from "@angular/fire/firestore";

export class Transaction {
    constructor(
		public IBAN_dest: string,
		public amount: number,
		public date: Date,
		public currency: string,
        public IBAN_src: AngularFirestoreDocument,
        public recurrent_days: number
	) {};
}
