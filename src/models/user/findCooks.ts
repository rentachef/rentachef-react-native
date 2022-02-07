import { observable } from 'mobx';

export default class ListModel {
  @observable cookId;
  @observable firstName;
  @observable lastName;
  @observable contactInfo;
  @observable cuisineList;
  @observable dishes;

  constructor(obj: any) {
    this.cookId = obj.cookId;
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
    this.contactInfo = obj.contactInfo;
    this.cuisineList = obj.cuisineList;
    this.dishes = obj.dishes;
  }
}
