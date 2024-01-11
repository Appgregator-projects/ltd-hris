import React from "react";
import InputText from "./InputText";
import SelectBox from "./SelectBox";
import InputDate from "./InputDate";
import InputNumber from "./InputNumber";
import UploadFile from "./UploadFile";
import TextEditor from "./TextEditor";
import Radio from "./Radio";
import Checkbox from "./Checkbox";

function ObjectClass(props) {
     const number = parseInt(props["data"]['element']["value"]);

     switch (number) {
          case 1:
               return <InputText properties={props} />;
          // case 2:
          //      return <SelectBox properties={props} />;
          case 3:
               return <Checkbox properties={props} />;
          case 5:
               return <InputDate properties={props} />;
          case 6:
               return <InputNumber properties={props} />;
          case 7:
               return <UploadFile properties={props} />;
          case 8:
               return <TextEditor properties={props} />;
          case 9:
               return <Radio properties={props} />;
          default:
               return <h1>No object match</h1>;
     }
}

export default ObjectClass;
