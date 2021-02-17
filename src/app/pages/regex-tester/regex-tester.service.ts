import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class RegexTesterService {
  constructor(private angularFirestore: AngularFirestore) {}

  saveExpression(name: string, expression: string, uid: string | undefined) {
    const collection = this.angularFirestore.collection('expressions');
    return collection.add({
      name,
      expression,
      uid,
    });
  }

  editExpresion(
    regexId: string,
    name: string,
    expression: string,
    uid: string | undefined
  ) {
    const docRef = this.angularFirestore.collection('expressions').doc(regexId);
    return docRef.set(
      {
        name,
        expression,
        uid,
      },
      { merge: true }
    );
  }
}
