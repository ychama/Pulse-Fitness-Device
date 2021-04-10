import API, {graphqlOperation} from "@aws-amplify/api";
import {listStudys} from "../../graphql/queries";
import motherService from "./motherService";

export const commonService = {
  async getMeetings() {
    return null;
  },
  async getListStudy(){
   let result=null;
   await API.graphql(graphqlOperation(listStudys)).then((resp)=>{
    result=resp.data.listStudys.items;
   }).catch((e)=>{
     console.log("Get error on fetch data",e);
    });
    return result;
  }
};
export default commonService;