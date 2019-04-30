import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {AutoRiaService, Language} from '../components/cars/shared/auto-ria/auto-ria.service';

export interface Region {
  nameUA?: string;
  nameEN?: string;
  nameRU?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  //
  private regionsCollection: AngularFirestoreCollection<Region>;
  private citiesCollection: AngularFirestoreCollection<Region>;
  // regions: Observable<RegionId[]>;

  constructor(private angularFirestore: AngularFirestore, private autoRiaService: AutoRiaService) {
    this.regionsCollection = this.angularFirestore.collection<Region>('regions');
    this.citiesCollection = this.angularFirestore.collection<Region>('cities');
    // this.regions = this.regionsCollection.snapshotChanges().pipe(
    //   map(actions => actions.map(a => {
    //     const data = a.payload.doc.data() as Region;
    //     const id = a.payload.doc.id;
    //     return { id, ...data };
    //   }))
    // );

    //   .pipe(
    //   map(actions => {
    //     return actions.map(a => {
    //       const data = a.playload.doc.data() as Region;
    //       const id = a.payload.doc.id;
    //       return {id, ...data};
    //     });
    //   })
    // );
  }

  setRegions(language: Language) {

    this.autoRiaService
      .getStates(language)
      .subscribe(resp => resp.forEach(region => {
        let reg: Region;
        switch (language) {
          case Language.UA:
            reg = {nameUA: region.name};
            break;
          case Language.EN:
            reg = {nameEN: region.name};
            break;
          case Language.RU:
            reg = {nameRU: region.name};
            break;
        }
        this.regionsCollection
          .doc(region.value.toString())
          .update(reg)
          .catch(console.log);
      }), console.log);

    // this.autoRiaService
    //   .getStates(Language.EN)
    //   .subscribe(resp => resp.forEach(region => {
    //     this.regionsCollection
    //       .doc(region.value.toString())
    //       .set({nameEN: region.name})
    //       .catch(console.log);
    //   }), console.log);
    //
    // this.autoRiaService
    //   .getStates(Language.RU)
    //   .subscribe(resp => resp.forEach(region => {
    //     this.regionsCollection
    //       .doc(region.value.toString())
    //       .set({nameRU: region.name})
    //       .catch(console.log);
    //   }), console.log);


    // this.angularFirestore
    //   .collection('regions')
    //   .add({name: regions.name, riaID: regions.value})
    //   .catch(console.log)
    //   .finally(() => {
    //     this.autoRiaService.getCities(regions.value)
    //       .subscribe(resp => {
    //         resp.forEach(v => {
    //           this.angularFirestore
    //             .collection('regions')
    //
    //             .doc(docRef.id)
    //             .collection('cities')
    //             .add({name: v.name})
    //             .catch(console.log)
    //             .finally(() => console.log('finished ', v.name, docRef.id, docRef));
    //         });
    //       }, error => console.log(error));
    //   });

    // this.angularFirestore
    //   .collection('regions')
    //   .add({name: regions.name, riaID: regions.value})
    //   .catch(console.log);
    //
    // this.angularFirestore
    //   .collection('regions').valueChanges()

    // this.autoRiaService
    //   .getStates(Language.UA)
    //   .subscribe(resp => {
    //     // this.regions = resp;
    //     resp.forEach(value => {
    //       this.regionsCollection
    //         .add({name: value.name, riaID: value.value})
    //         .catch(console.log);
    //     });
    //   }, error => console.log(error));
    //
    // this.regions.forEach(r => r.map(value => {
    //   this.autoRiaService
    //     .getCities(value.riaID)
    //     .subscribe(resp => resp.forEach(val => {
    //       this.regionsCollection
    //         .doc(value.id)
    //         .collection('cities')
    //         .add({name: val.name, riaID: val.value})
    //         .catch(console.log);
    //   }));
    // })).catch(console.log);
  }

  setOther() {
    this.regionsCollection.get()
      .forEach(resp => resp.docs.map(value => {
        this.setCities(Number.parseInt(value.id, 10));
      }))
      .catch(console.log);
  }

  setCities(regionId: number) {
    // this.angularFirestore
    //   .collection('/cities')
    //   .doc(regions.value.toString())
    //   .set({name: regions.name})
    //   .catch(console.log);

    const ref = this.regionsCollection.doc(regionId.toString()).ref;

    this.autoRiaService
      .getCities(regionId, Language.UA)
      .subscribe(resp => resp.forEach(city => {
        this.citiesCollection
          .doc(city.value.toString())
          .set({region: ref, nameUA: city.name})
          .catch(console.log);
      }), console.log);

    this.autoRiaService
      .getCities(regionId, Language.EN)
      .subscribe(resp => resp.forEach(city => {
        this.citiesCollection
          .doc(city.value.toString())
          .set({nameEN: city.name})
          .catch(console.log);
      }), console.log);

    this.autoRiaService
      .getCities(regionId, Language.RU)
      .subscribe(resp => resp.forEach(city => {
        this.citiesCollection
          .doc(city.value.toString())
          .set({nameRU: city.name})
          .catch(console.log);
      }), console.log);
  }
}
