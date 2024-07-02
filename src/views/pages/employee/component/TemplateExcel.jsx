import React, { useEffect, useState } from 'react'
import { Download } from 'react-feather'
import { Button } from 'reactstrap'
import Api from '../../../../sevices/Api'
import { Workbook } from 'exceljs'
const TemplateExcel = ({ clicks, setClicks }) => {
  const [header, setHeader] = useState([])

  console.log(clicks, "click")

  const getColumns = async () => {
    const dataHeader = await Api.get(`/auth/column-db`);

    if (dataHeader.status) {
      const fixHeader = dataHeader.data.users;
      console.log(fixHeader, "ni data");
      setHeader(fixHeader);

      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet("Users");

      // Add header row
      worksheet.addRow(fixHeader);

      const todayDate = new Date().toISOString().split('T')[0];
      const createObject = () => {
        return fixHeader.reduce((acc, key) => {
          if (['division_id', 'avatar', 'accurate_id', 'id'].includes(key)) {
            acc[key] = false;
          } else if (['fcm_token', 'expo_token', 'updatedAt', 'deletedAt', "departement_id", "role_id"].includes(key)) {
            acc[key] = null;
          } else if (key === 'createdAt') {
            acc[key] = todayDate;
          } else {
            acc[key] = true;
          }
          return acc;
        }, {});
      };

      // Create an array of 5 objects
      const list = Array.from({ length: 5 }, () => createObject());

      list.forEach((item) => {
        const rowValues = Object.values(item);
        worksheet.addRow(rowValues);
      });

      const getColumnIndexByHeader = (headerName) => {
        let columnIndex;
        worksheet.getRow(1).eachCell((cell, colNumber) => {
          if (cell.value === headerName) {
            columnIndex = colNumber;
          }
        });
        return columnIndex;
      };

      const getColumnLetter = (colNumber) => {
        let temp, letter = '';
        while (colNumber > 0) {
          temp = (colNumber - 1) % 26;
          letter = String.fromCharCode(temp + 65) + letter;
          colNumber = (colNumber - temp - 1) / 26;
        }
        return letter;
      };

      // Get the column index for "departement_id" and "role_id"
      const departmentsColumnIndex = getColumnIndexByHeader('departement_id');
      const rolesColumnIndex = getColumnIndexByHeader('role_id');

      const departmentsColumnLetter = getColumnLetter(departmentsColumnIndex);
      const rolesColumnLetter = getColumnLetter(rolesColumnIndex);

      console.log(dataHeader.data.departments.length,"panjang")
      // Corrected formulas for data validation
      const formattedArrayDept = dataHeader.data.departments.slice(0, 21).join(',');
      const formattedArrayRoles = dataHeader.data.roles.join(',');

      console.log(formattedArrayDept, "dept array", formattedArrayRoles, "roles array");
      console.log(departmentsColumnLetter, "dept column letter", rolesColumnLetter, "roles column letter");

      list.forEach((_, index) => {
        const deptCell = worksheet.getCell(`${departmentsColumnLetter}${index + 2}`);
        const roleCell = worksheet.getCell(`${rolesColumnLetter}${index + 2}`);

        deptCell.dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [`"${formattedArrayDept}"`],
        };
        roleCell.dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [`"${formattedArrayRoles}"`],
        };

        console.log(`Setting data validation for row ${index + 2}:`, deptCell.address, roleCell.address);
      });

      console.log(list, "list");

      workbook.xlsx
        .writeBuffer()
        .then((buffer) => {
          let blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          saveAs(blob, "bulk-user.xlsx");
        })
        .catch((error) => {
          console.error("Error writing excel file:", error);
        });
    }
  };




  return (
    <Button.Ripple onClick={getColumns} color='primary' size="sm"> <Download size={16} className='me-1' /> Download Template</Button.Ripple>
  )
}

export default TemplateExcel