import { Input, InputGroup, InputGroupText } from "reactstrap";

const InputPrice = ({
     id,
     inputValue,
     setInputValue,
     onInputChange,
     type,
     disabled,
}) => {
     function formatNumber(n) {
          return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
     }

     function formatCurrency(e) {
          let input_val = e.target.value;

          if (input_val === "") {
               if (!type) {
                    setInputValue("");
               } else {
                    onInputChange("");
               }
               return;
          }

          input_val = formatNumber(input_val);

          if (!type) {
               setInputValue(input_val);
          } else {
               onInputChange(input_val);
          }

          let caret_pos = e.target.selectionStart;
          e.target.setSelectionRange(caret_pos, caret_pos);
     }

     return (
          <InputGroup className="input-group-merge">
               <InputGroupText>Rp</InputGroupText>
               <Input
                    id={id ? id : ""}
                    type="text"
                    value={inputValue}
                    onChange={formatCurrency}
                    onBlur={formatCurrency}
                    data-type="currency"
                    disabled={disabled ? disabled : false}
               />
          </InputGroup>
     );
};

export default InputPrice;