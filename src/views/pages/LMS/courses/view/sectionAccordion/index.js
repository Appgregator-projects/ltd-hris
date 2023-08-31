import { useEffect, useState } from "react";
// ** Reactstrap Imports
import {
  Accordion,
  AccordionBody,
  AccordionItem,
  Col,
  ListGroupItem,
  Row,
} from "reactstrap";
import LessonAccordion from "../lessonAccordion";

// ** Third Party Components
import Prism from "prismjs";
import { ReactSortable } from "react-sortablejs";

import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { List } from "react-feather";

import AddLesson from "./AddLesson";
import ManageLesson from "./ManageLesson";

const SectionAccordion = ({ data }) => {
  let courseData = [{}, {}, {}];

  const [lessonList, setLessonList] = useState([...data.lesson_list]);
  console.log(lessonList)

  const [open, setOpen] = useState("1");
  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };

  useEffect(() => {
    Prism.highlightAll();
  }, []);
  return (
    <Accordion open={open} toggle={toggle}>
      <AccordionItem>
        <Row>
          <Col className="pt-1">
            <h5>
              <List size={25} className="me-1 ms-1 handle" />
              {data.section_title}
            </h5>
          </Col>

          <Col className="d-flex justify-content-end">
            <AddLesson title={data.section_title} />

            <ManageLesson />

            <div className="p-1">
              {open === "1" ? (
                <RiArrowUpSLine size={24} onClick={() => toggle("1")} />
              ) : (
                <RiArrowDownSLine size={24} onClick={() => toggle("1")} />
              )}
            </div>
          </Col>
        </Row>

        <AccordionBody accordionId="1">
          <ReactSortable
            tag="ul"
            className="list-group sortable"
            group="shared-handle-group"
            handle=".handle"
            list={lessonList}
            setList={setLessonList}
          >
            {lessonList?.map((item, index) => {
              return (
                <ListGroupItem key={index} className="p-0 border-0">
                  <LessonAccordion data={item} />
                </ListGroupItem>
              );
            })}
          </ReactSortable>
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  );
};

export default SectionAccordion;
