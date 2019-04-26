import {Component, OnInit} from '@angular/core';
import {LocationService} from '../../../core/location.service';
import {AutoRiaService, Language} from '../../cars/shared/auto-ria/auto-ria.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit {

  constructor(private locationService: LocationService,
              private autoRiaService: AutoRiaService,
              private toastService: ToastrService) { }

  ngOnInit() {
    // this.autoRiaService
    //   .getStates()
    //   .subscribe(resp => {
    //     // this.regions = resp;
    //     resp.forEach(value => {
    //       this.locationService.setRegions(value);
    //     });
    //   }, error => console.log(error));
  }

  onGenerateLocations(lang: string) {
    let language: Language;
    switch (lang) {
      case 'ua':
        language = Language.UA;
        break;
      case 'en':
        language = Language.EN;
        break;
      case 'ru':
        language = Language.RU;
        break;
    }

    this.locationService.setRegions(language);
    // this.locationService.setOther();
    this.toastService.success('Submitted Successfully', 'Car Register');
  }
}
