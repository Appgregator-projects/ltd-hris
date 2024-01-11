import React, { Fragment, useEffect, useState } from 'react'

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";

// ** Reactstrap Imports
import { Card } from "reactstrap";
import DataTable from "react-data-table-component";


//** Icons
import { Badge, Table } from "reactstrap";
import { auth } from '../../../../configs/firebase';
import { getCollectionFirebase, getSingleDocumentFirebase } from '../../../../sevices/FirebaseApi';
import { columnsScore } from '../../LMS/store/data';

const Scores = () => {
     const [score, setScore] = useState([])
     const uid = auth?.currentUser?.uid

     //** Fetch data

     const fetchDataQuiz = async () => {
          const conditions = [
               {
                    field: "scores",
                    operator: "array-contains",
                    value: uid,
               },
          ];
          const res = await getCollectionFirebase(`quizzes`);
          setScore(res);
     };

     useEffect(() => {
          fetchDataQuiz()
          return () => {
               setScore([])
          }
     }, [])

     console.log(score, 'ni sccore')

     return (
          <Fragment>
               <Breadcrumbs title="Scores" data={[{ title: "Scores" }]} />
               <Card>
                    <DataTable
                         // noHeader
                         columns={columnsScore}
                         data={score}

                    />
               </Card>
          </Fragment>
     )
}

export default Scores