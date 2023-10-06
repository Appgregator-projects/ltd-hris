import React, { forwardRef, useState } from "react";
import { Fragment } from "react";
import { Check, ChevronDown, User } from "react-feather";
import { Card, CardBody, CardHeader, Col, Input, Label, Row } from "reactstrap";
// ** Custom Components
import Avatar from "../../../../../@core/components/avatar/index";
import DataTable from "react-data-table-component";
import { columns, data, states } from "../../store/data";
import ReactPaginate from "react-paginate";
import { getCollectionFirebase } from "../../../../../sevices/FirebaseApi";
import { useEffect } from "react";

const LogActivityTabs = ({ quizList, setQuizList, dataQuiz }) => {
	const [searchValue, setSearchValue] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [dataUser, setDataUser] = useState([]);
	const [activityQuiz, setActivityQuiz] = useState({});
	// Fetch data activity log
	// const fetchDataActivity = async () =>{
	// 	const res = getCollectionFirebase('quizzes')
	// }

	//** Handle
	const handleFilter = (e) => {
		const value = e.target.value;
		let updatedData = [];
		setSearchValue(value);

		if (value.length) {
			updatedData = dataUser.filter((item) => {
				const startsWith =
					item?.name
						?.toLowerCase()
						.startsWith(value.toLowerCase()) ||
					item?.email
						?.toLowerCase()
						.startsWith(value.toLowerCase());

				const includes =
					item?.name
						?.toLowerCase()
						.includes(value.toLowerCase()) ||
					item?.email
						?.toLowerCase()
						.includes(value.toLowerCase());

				if (startsWith) {
					return startsWith;
				} else if (!startsWith && includes) {
					return includes;
				} else return null;
			});
			setFilteredData(updatedData);
			setSearchValue(value);
		}
	};

	// ** Function to handle Pagination
	const handlePagination = (page) => {
		setCurrentPage(page.selected);
	};

	// ** Expandable table component
	const ExpandableTable = ({ data }) => {
		return (
			<div className="d-flex mb-1">
				{quizList?.map((item, index) => (
					<div
						className="expandable-content px-1"
						style={{ textAlign: "center" }}
						key={index}
					>
						<p className="m-0">{index + 1}</p>
						<Input
							type="checkbox"
							checked={
								item.isCorrectAnswer ===
									data.answer[index].answer &&
								item.question_index ===
									data.answer[index].id
							}
							disabled
						/>
					</div>
				))}
			</div>
		);
	};

	// ** Custom Pagination
	const CustomPagination = () => (
		<ReactPaginate
			previousLabel=""
			nextLabel=""
			forcePage={currentPage}
			onPageChange={(page) => handlePagination(page)}
			pageCount={
				searchValue.length
					? Math.ceil(filteredData.length / 7)
					: Math.ceil(dataUser.length / 7) || 1
			}
			breakLabel="..."
			pageRangeDisplayed={2}
			marginPagesDisplayed={2}
			activeClassName="active"
			pageClassName="page-item"
			breakClassName="page-item"
			nextLinkClassName="page-link"
			pageLinkClassName="page-link"
			breakLinkClassName="page-link"
			previousLinkClassName="page-link"
			nextClassName="page-item next-item"
			previousClassName="page-item prev-item"
			containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
		/>
	);

	useEffect(() => {
		let newData = dataQuiz;
		if (newData.length !== 0) {
			const newDataQuizScores = newData.scores.map((score) => ({
				...score,
				minGrade: parseInt(newData.quiz_minGrade), // Ganti 'xx' dengan id yang Anda inginkan
			}));
			const seenUIDs = new Set();
			let passed = 0;
			let enrolled = 0;

			newData.scores.forEach((score) => {
				if (!seenUIDs.has(score.uid)) {
					enrolled += score.score;
					seenUIDs.add(score.uid);
				}

				if (score.score >= dataQuiz.quiz_minGrade) {
					passed++;
				}
			});

			setActivityQuiz({
				passed: passed,
				enrolled: seenUIDs.size,
			});
			setDataUser(newDataQuizScores);
		}

		return () => {
			setDataUser([]);
		};
	}, [dataQuiz.scores]);

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
							<h2 className="fw-bolder mt-1">
								{activityQuiz?.enrolled}
							</h2>
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
							<h2 className="fw-bolder mt-1">
								{activityQuiz?.passed}
							</h2>
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
						<h3>Quiz Activity</h3>
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
							onChange={handleFilter}
						/>
					</Col>
				</Row>
				<div className="react-dataTable react-dataTable-selectable-rows">
					<DataTable
						noHeader
						pagination
						// data={searchValue.length ? filteredData : data}
						data={
							searchValue.length ? filteredData : dataUser
						}
						expandableRows
						columns={columns}
						expandOnRowClicked
						className="react-dataTable"
						sortIcon={<ChevronDown size={10} />}
						paginationComponent={CustomPagination}
						paginationDefaultPage={currentPage + 1}
						expandableRowsComponent={ExpandableTable}
						paginationRowsPerPageOptions={[10, 25, 50, 100]}
					/>
				</div>
			</Row>
		</Fragment>
		// <></>
	);
};

export default LogActivityTabs;
