// ** Reactstrap Imports
import { List } from "react-feather";
import { Accordion, AccordionBody, AccordionItem, Col, Row } from "reactstrap";
import LessonAccordion from "../lessonAccordion";

// ** Third Party Components
import Prism from "prismjs";
import { useEffect, useState } from "react";

import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import AddLesson from "./AddLesson";
import ManageLesson from "./ManageLesson";

const SectionAccordion = () => {
  let courseData = [{}, {}, {}];

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
              <List size={15} className="me-1 ms-1" />
              Section Item 1
            </h5>
          </Col>

          <Col className="d-flex justify-content-end">
            <AddLesson />

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
          {courseData.map((item, index) => {
            return <LessonAccordion key={index} />;
          })}
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  );
};

export default SectionAccordion;
