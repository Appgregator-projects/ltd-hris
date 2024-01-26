import React, { forwardRef, useEffect, useState } from "react";
import { Fragment } from "react";
import { Check, ChevronDown, Loader, User } from "react-feather";
import {
	Button,
	Card,
	CardBody,
	Col,
	Input,
	Label,
	Row,
	Spinner,
} from "reactstrap";
// ** Custom Components
import Avatar from "../../../../../../@core/components/avatar/index";
import DataTable from "react-data-table-component";
import { columnsLogCourse } from "../../../store/data";
import ReactPaginate from "react-paginate";
import { getCollectionFirebase } from "../../../../../../sevices/FirebaseApi";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const LogActivityTab = ({ courseData }) => {
	const param = useParams();
	const store = useSelector((store) => store.coursesSlice);

	const [searchValue, setSearchValue] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [logActivity, setLogActivity] = useState([]);
	const [loadData, setLoadData] = useState({
		enrolled: false,
		passed: false,
	});

	const [userCourse, setUserCourse] = useState([]);
	const [finishCourse, setFinishCourse] = useState([]);
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
				let newLogActivity = res
					.map((item) => {
						return item.history.map((log) => ({
							...log,
							name: item?.user?.name,
							email: item?.user?.email,
							course: courseData?.course_title,
						}));
					})
					.flat();

				setLogActivity(newLogActivity);
			}
		} catch (error) {
			throw error;
		}
	};

	const fetchUserCourse = async () => {
		setLoadData({ ...loadData, enrolled: true });
		const conditions = [
			{
				field: "group_courses",
				operator: "array-contains",
				value: param.id,
			},
		];
		const members = new Set();
		try {
			const res = await getCollectionFirebase("groups", conditions);
			if (res) {
				setLoadData({ ...loadData, enrolled: false });

				res.forEach((x) => {
					x.group_members.forEach((y) => {
						members.add(y);
					});
				});

				const uniqueArray = Array.from(members);
				setUserCourse(uniqueArray);
			}
		} catch (error) {
			setLoadData({ ...loadData, enrolled: false });
			throw error;
		}
	};

	const fetchDataFinished = () => {
		let data = logActivity;
		const groupedData = {};
		data.forEach((item) => {
			const email = item.email;
			if (email) {
				if (!groupedData[email]) {
					groupedData[email] = {
						nama: item.name || "",
						email: email,
						course_activity: [],
					};
				}
				groupedData[email].course_activity.push({
					section_title: item.section_title,
					lesson_title: item.lesson_title,
					section_id: item.section_id,
					lastUpdated: item.lastUpdated,
				});
			}
		});
		const result = Object.values(groupedData);

		const newArray = result.filter(
			(entry) =>
				// console.log({entry})
				entry.course_activity.length ===
				store.lessonPerCourse.length
		);

		setFinishCourse(newArray);
	};

	//** Handle
	const handleFilter = (e) => {
		const value = e.target.value;
		let updatedData = [];
		setSearchValue(value);

		if (value.length) {
			updatedData = logActivity.filter((item) => {
				console.log({ item });
				const startsWith =
					item?.name
						?.toLowerCase()
						.startsWith(value.toLowerCase()) ||
					item?.email
						?.toLowerCase()
						.startsWith(value.toLowerCase()) ||
					item?.lesson_title
						?.toLowerCase()
						.startsWith(value.toLowerCase()) ||
					item?.section_title
						?.toLowerCase()
						.startsWith(value.toLowerCase()) ||
					item?.course
						?.toLowerCase()
						.startsWith(value.toLowerCase()) ||
					item?.date
						?.toLowerCase()
						.startsWith(value.toLowerCase());

				const includes =
					item?.name
						?.toLowerCase()
						.includes(value.toLowerCase()) ||
					item?.email
						?.toLowerCase()
						.startsWith(value.toLowerCase()) ||
					item?.lesson_title
						?.toLowerCase()
						.includes(value.toLowerCase()) ||
					item?.section_title
						?.toLowerCase()
						.includes(value.toLowerCase()) ||
					item?.course
						?.toLowerCase()
						.includes(value.toLowerCase()) ||
					item?.date
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

	// ** Custom Pagination
	const CustomPagination = () => (
		<ReactPaginate
			previousLabel=""
			nextLabel=""
			forcePage={currentPage}
			onPageChange={(page) => handlePagination(page)}
			pageCount={
				searchValue.length
					? Math.ceil(filteredData.length / 10)
					: Math.ceil(logActivity.length / 10) || 1
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
		fetchLogActivity();

		return () => {
			setLogActivity([]);
			setUserCourse([]);
			setSearchValue([]);
			setFilteredData([]);
			setCurrentPage(0);

			setLoadData({
				enrolled: false,
				passed: false,
			});
		};
	}, []);

	useEffect(() => { }, [courseData.course_title]);
	return (
		<Fragment>
			<Row className="mb-1">
				<Col>
					<h3>Log Activity</h3>
				</Col>
			</Row>
			<Row className="mb-1">
				<Col lg="6" sm="6">
					<Card>
						{!loadData.enrolled && userCourse.length === 0 ? (
							<Button.Ripple
								color="flat-primary"
								onClick={() => fetchUserCourse()}
							>
								<Loader className="me-1" />
								See Data
							</Button.Ripple>
						) : !loadData.enrolled &&
							userCourse.length > 0 ? (
							<CardBody>
								<Avatar
									className="avatar-stats p-50 m-0"
									color={`light-primary`}
									icon={<User />}
								/>
								<h2 className="fw-bolder mt-1">
									{userCourse.length}
								</h2>
								<p className="card-text">Enrolled</p>
							</CardBody>
						) : (
							<div className="d-flex justify-content-center">
								<Spinner />
							</div>
						)}
					</Card>
				</Col>
				<Col lg="6" sm="6">
					<Card>
						{!loadData.passed && finishCourse.length === 0 ? (
							<Button.Ripple
								color="flat-primary"
								onClick={() => fetchDataFinished()}
							>
								<Loader className="me-1" />
								See Data
							</Button.Ripple>
						) : !loadData.passed &&
							finishCourse.length > 0 ? (
							<CardBody>
								<Avatar
									className="avatar-stats p-50 m-0"
									color={`light-success`}
									icon={<Check />}
								/>
								<h2 className="fw-bolder mt-1">
									{finishCourse.length}
								</h2>
								<p className="card-text">Passed</p>
							</CardBody>
						) : (
							<Spinner />
						)}
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
							onChange={handleFilter}
						/>
					</Col>
				</Row>
				<div className="react-dataTable react-dataTable-selectable-rows">
					<DataTable
						noHeader
						pagination
						data={
							searchValue.length
								? filteredData
								: logActivity
						}
						columns={columnsLogCourse}
						className="react-dataTable"
						sortIcon={<ChevronDown size={10} />}
						paginationComponent={CustomPagination}
						paginationDefaultPage={currentPage + 1}
						paginationRowsPerPageOptions={[10, 25, 50, 100]}
					/>
				</div>
			</Row>
		</Fragment>
	);
};

export default LogActivityTab;
