import { DocumentReference } from "@angular/fire/firestore";

export class Transaction {
    constructor(
		public IBAN_dest: string,
		public sum: number,
		public date: Date,
		public currency: string,
        public IBAN_src: DocumentReference,
        public recurrent_days: number
	) {};
}
