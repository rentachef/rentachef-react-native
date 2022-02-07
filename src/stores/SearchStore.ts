import {action, makeAutoObservable, observable} from "mobx";
import ListModel from "../models/user/findCooks";

class SearchStore {
  rootStore: any;
  @observable list = [];

  constructor(/*rootStore: any*/) {
    makeAutoObservable(this)
  }

  getData = async () => {
    const response = await fetch('http://rentachefuser-dev-env.us-east-1.elasticbeanstalk.com/findCooks?latitude=1&longitude=1&searchradius=5&cuisines=INDO_PAK&cuisines=VIETNAMESE&startIndex=1&endIndex=5');
    console.log("response", response)
    const data = response.json;
  };

  changeList = (data: any) => {
    const obj = new ListModel(data);
    this.setList(obj);
  };

  @action
  setList(data: any) {
    this.list.push(data);
    console.log(this.list);
  }


}

export default SearchStore
