import React, { forwardRef, useEffect, useState } from "react";
import { Fragment } from "react";
import { Check, ChevronDown, User } from "react-feather";
import { Card, CardBody, CardHeader, Col, Input, Label, Row } from "reactstrap";
// ** Custom Components
import Avatar from "../../../../../../@core/components/avatar/index";
import DataTable from "react-data-table-component";
import { columnsLogCourse, dataLogCourse, states } from "../../../store/data";
import ReactPaginate from "react-paginate";
import {
	getCollectionFirebase,
	getSingleDocumentFirebase,
} from "../../../../../../sevices/FirebaseApi";
import { auth } from "../../../../../../configs/firebase";
import { useParams } from "react-router-dom";

const LogActivityTab = ({ courseData }) => {
	const param = useParams();
	const [searchValue, setSearchValue] = useState("");
	const [filteredData, setFilteredData] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [logActivity, setLogActivity] = useState([]);

	// ** Bootstrap Checkbox Component
	const BootstrapCheckbox = forwardRef((props, ref) => (
		<div className="form-check">
			<Input type="checkbox" ref={ref} {...props} />
		</div>
	));

	console.log(courseData.course_title);

	//** Fetch data
	const fetchLogActivity = async () => {
		try {
			const conditions = [
				{
					field: "course_id",
					operator: "==",
					value: param.id,
				},
			];
			const res = await getCollectionFirebase(
				"user_course_progress",
				conditions
			);
			if (res) {
				console.log({ res });
				let newLogActivity = res
					.map((item) => {
						console.log({ item });
						return item.history.map((log) => ({
							...log,
							name: item?.user?.name, // Pastikan item.name adalah nama yang diinginkan
							email: item?.user?.email, // Pastikan item.email adalah email yang diinginkan
							course: courseData?.course_title, // Pastikan courseData.course_title adalah judul kursus yang diinginkan
						}));
					})
					.flat(); // Menggunakan flat untuk menggabungkan array dalam array

				console.log({ newLogActivity });

				setLogActivity(newLogActivity);
			}

		} catch (error) {
			throw error;
		}
	};
	console.log({ logActivity });
	//** Handle
	// const handleFilter = (e) => {
	// 	const value = e.target.value;
	// 	let updatedData = [];
	// 	setSearchValue(value);

	// 	const status = {
	// 		1: { title: "Current", color: "light-primary" },
	// 		2: { title: "Professional", color: "light-success" },
	// 		3: { title: "Rejected", color: "light-danger" },
	// 		4: { title: "Resigned", color: "light-warning" },
	// 		5: { title: "Applied", color: "light-info" },
	// 	};

	// 	if (value.length) {
	// 		updatedData = dataLogCourse.filter((item) => {
	// 			const startsWith =
	// 				item.full_name
	// 					.toLowerCase()
	// 					.startsWith(value.toLowerCase()) ||
	// 				item.lesson
	// 					.toLowerCase()
	// 					.startsWith(value.toLowerCase()) ||
	// 				item.email
	// 					.toLowerCase()
	// 					.startsWith(value.toLowerCase()) ||
	// 				item.section
	// 					.toLowerCase()
	// 					.startsWith(value.toLowerCase()) ||
	// 				item.course
	// 					.toLowerCase()
	// 					.startsWith(value.toLowerCase()) ||
	// 				item.start_date
	// 					.toLowerCase()
	// 					.startsWith(value.toLowerCase()) ||
	// 				status[item.status].title
	// 					.toLowerCase()
	// 					.startsWith(value.toLowerCase());

	// 			const includes =
	// 				item.full_name
	// 					.toLowerCase()
	// 					.includes(value.toLowerCase()) ||
	// 				item.section
	// 					.toLowerCase()
	// 					.includes(value.toLowerCase()) ||
	// 				item.email
	// 					.toLowerCase()
	// 					.includes(value.toLowerCase()) ||
	// 				item.lesson
	// 					.toLowerCase()
	// 					.includes(value.toLowerCase()) ||
	// 				item.course
	// 					.toLowerCase()
	// 					.includes(value.toLowerCase()) ||
	// 				item.start_date
	// 					.toLowerCase()
	// 					.includes(value.toLowerCase()) ||
	// 				status[item.status].title
	// 					.toLowerCase()
	// 					.includes(value.toLowerCase());

	// 			if (startsWith) {
	// 				return startsWith;
	// 			} else if (!startsWith && includes) {
	// 				return includes;
	// 			} else return null;
	// 		});
	// 		setFilteredData(updatedData);
	// 		setSearchValue(value);
	// 	}
	// };

	// ** Function to handle Pagination
	// const handlePagination = (page) => {
	// 	setCurrentPage(page.selected);
	// };

	// ** Expandable table component
	const ExpandableTable = ({ data }) => {
		return courseData?.map((item, index) => (
			<div className="expandable-content px-2" key={index}>
				<p className="m-0">{index + 1}</p>
				<Input type="checkbox" disabled />
			</div>
		));
	};

	// ** Custom Pagination
	// const CustomPagination = () => (
	// 	<ReactPaginate
	// 		previousLabel=""
	// 		nextLabel=""
	// 		forcePage={currentPage}
	// 		onPageChange={(page) => handlePagination(page)}
	// 		pageCount={
	// 			searchValue.length
	// 				? Math.ceil(filteredData.length / 10)
	// 				: Math.ceil(dataLogCourse.length / 10) || 1
	// 		}
	// 		breakLabel="..."
	// 		pageRangeDisplayed={2}
	// 		marginPagesDisplayed={2}
	// 		activeClassName="active"
	// 		pageClassName="page-item"
	// 		breakClassName="page-item"
	// 		nextLinkClassName="page-link"
	// 		pageLinkClassName="page-link"
	// 		breakLinkClassName="page-link"
	// 		previousLinkClassName="page-link"
	// 		nextClassName="page-item next-item"
	// 		previousClassName="page-item prev-item"
	// 		containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
	// 	/>
	// );
	useEffect(() => {
		fetchLogActivity();

		return () => {
			setLogActivity([]);
		};
	}, []);

	useEffect(() => {}, [courseData]);
	return (
		<Fragment>
			<Row className="mb-1">
				<Col>
					<h3>Log Activity</h3>
				</Col>

				{/* <Col className="d-flex justify-content-end">
                <Button.Ripple className="btn-icon" color={"primary"} outline>
                  <Settings size={14} />
                </Button.Ripple>
              </Col> */}
			</Row>
			<Row className="mb-1">
				<Col lg="6" sm="6">
					<Card>
						<CardBody>
							<Avatar
								className="avatar-stats p-50 m-0"
								color={`light-primary`}
								icon={<User />}
							/>
							<h2 className="fw-bolder mt-1">16</h2>
							<p className="card-text">Enrolled</p>
						</CardBody>
						{/* <Chart
							options={options}
							series={series}
							type={type}
							height={height ? height : 100}
						/> */}
					</Card>
				</Col>
				<Col lg="6" sm="6">
					<Card>
						<CardBody>
							<Avatar
								className="avatar-stats p-50 m-0"
								color={`light-success`}
								icon={<Check />}
							/>
							<h2 className="fw-bolder mt-1">8</h2>
							<p className="card-text">Passed</p>
						</CardBody>
						{/* <Chart
							options={options}
							series={series}
							type={type}
							height={height ? height : 100}
						/> */}
					</Card>
				</Col>

				<Row className="justify-space mx-0">
					<Col className=" mt-1">
						<h3>Course Activity</h3>
					</Col>
					<Col
						className="d-flex align-items-center justify-content-end mt-1"
						md="6"
						sm="12"
					>
						<Label className="me-1" for="search-input">
							Search
						</Label>
						<Input
							className="dataTable-filter mb-50"
							type="text"
							bsSize="sm"
							id="search-input"
							value={searchValue}
							// onChange={handleFilter}
						/>
					</Col>
				</Row>
				<div className="react-dataTable react-dataTable-selectable-rows">
					<DataTable
						noHeader
						pagination
						data={logActivity.length > 0 ? logActivity : []}
						// searchValue.length
						// 		? filteredData
						// 		:
						// expandableRows
						columns={columnsLogCourse}
						// expandOnRowClicked
						className="react-dataTable"
						// sortIcon={<ChevronDown size={10} />}
						// paginationComponent={CustomPagination}
						// paginationDefaultPage={currentPage + 1}
						// expandableRowsComponent={ExpandableTable}
						paginationRowsPerPageOptions={[10, 25, 50, 100]}
					/>
				</div>
			</Row>
		</Fragment>
	);
};

export default LogActivityTab;
