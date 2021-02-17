import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class RegexListService {
  constructor(private angularFirestore: AngularFirestore) {}

  listRegexByUser(userId: string) {
    return this.angularFirestore
      .collection('expressions', (ref) => {
        return ref.where('uid', '==', userId);
      })
      .valueChanges({ idField: 'id' });
  }

  deleteRegex(regexId: string) {
    return this.angularFirestore
      .collection('expressions')
      .doc(regexId)
      .delete();
  }
}
