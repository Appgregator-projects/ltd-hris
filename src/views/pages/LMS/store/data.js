import {
	Badge,
	Button,
	Col,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Modal,
	ModalBody,
	ModalHeader,
	UncontrolledDropdown,
} from "reactstrap";
import { Archive, Edit, FileText, MoreVertical, Trash } from "react-feather";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Api from '../../../../sevices/Api'
import Avatar from "../../../../@core/components/avatar";
import avatar1 from "@src/assets/images/portrait/small/avatar-s-1.jpg";
import avatar2 from "@src/assets/images/portrait/small/avatar-s-2.jpg";
import avatar3 from "@src/assets/images/portrait/small/avatar-s-3.jpg";
import avatar4 from "@src/assets/images/portrait/small/avatar-s-4.jpg";
import avatar5 from "@src/assets/images/portrait/small/avatar-s-5.jpg";
import avatar6 from "@src/assets/images/portrait/small/avatar-s-6.jpg";
import avatar7 from "@src/assets/images/portrait/small/avatar-s-7.jpg";
import avatar8 from "@src/assets/images/portrait/small/avatar-s-8.jpg";
import avatar9 from "@src/assets/images/portrait/small/avatar-s-9.jpg";
import avatar10 from "@src/assets/images/portrait/small/avatar-s-10.jpg";
import { dateFormat, dateTimeFormat } from "../../../../Helper";
import dayjs from "dayjs";
import { Fragment, useState } from "react";
import DataTable from "react-data-table-component";
import { auth } from "../../../../configs/firebase";


// ** Vars
export const states = [
	"success",
	"danger",
	"warning",
	"info",
	"dark",
	"primary",
	"secondary",
];

const status = {
	1: { title: "Passed", color: "light-success" },
	2: { title: "Failed", color: "light-danger" },
};

const uid = JSON.parse(localStorage.getItem("userData"))?.id
const MySwal = withReactContent(Swal);


export const data = [
	{
		responsive_id: "",
		id: 1,
		avatar: avatar10,
		full_name: "Korrie O'Crevy",
		post: "Nuclear Power Engineer",
		email: "kocrevy0@thetimes.co.uk",
		city: "Krasnosilka",
		start_date: "09/23/2016",
		salary: "$23896.35",
		attempted: "61",
		score: "70%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 2,
		avatar: avatar1,
		full_name: "Bailie Coulman",
		post: "VP Quality Control",
		email: "bcoulman1@yolasite.com",
		city: "Hinigaran",
		start_date: "05/20/2018",
		salary: "$13633.69",
		attempted: "63",
		score: "80%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 3,
		avatar: avatar9,
		full_name: "Stella Ganderton",
		post: "Operator",
		email: "sganderton2@tuttocitta.it",
		city: "Golcowa",
		start_date: "03/24/2018",
		salary: "$13076.28",
		attempted: "66",
		score: "95%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 4,
		avatar: avatar10,
		full_name: "Dorolice Crossman",
		post: "Cost Accountant",
		email: "dcrossman3@google.co.jp",
		city: "Paquera",
		start_date: "12/03/2017",
		salary: "$12336.17",
		attempted: "22",
		score: "75%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 5,
		avatar: "",
		full_name: "Harmonia Nisius",
		post: "Senior Cost Accountant",
		email: "hnisius4@gnu.org",
		city: "Lucan",
		start_date: "08/25/2017",
		salary: "$10909.52",
		attempted: "33",
		score: "80%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 6,
		avatar: "",
		full_name: "Genevra Honeywood",
		post: "Geologist",
		email: "ghoneywood5@narod.ru",
		city: "Maofan",
		start_date: "06/01/2017",
		salary: "$17803.80",
		attempted: "61",
		score: "70%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 7,
		avatar: "",
		full_name: "Eileen Diehn",
		post: "Environmental Specialist",
		email: "ediehn6@163.com",
		city: "Lampuyang",
		start_date: "10/15/2017",
		salary: "$18991.67",
		attempted: "59",
		score: "100%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 8,
		avatar: avatar9,
		full_name: "Richardo Aldren",
		post: "Senior Sales Associate",
		email: "raldren7@mtv.com",
		city: "Skoghall",
		start_date: "11/05/2016",
		salary: "$19230.13",
		attempted: "55",
		score: "90%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 9,
		avatar: avatar2,
		full_name: "Allyson Moakler",
		post: "Safety Technician",
		email: "amoakler8@shareasale.com",
		city: "Mogilany",
		start_date: "12/29/2018",
		salary: "$11677.32",
		attempted: "39",
		score: "100%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 10,
		avatar: avatar9,
		full_name: "Merline Penhalewick",
		post: "Junior Executive",
		email: "mpenhalewick9@php.net",
		city: "Kanuma",
		start_date: "04/19/2019",
		salary: "$15939.52",
		attempted: "23",
		score: "80%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 11,
		avatar: "",
		full_name: "De Falloon",
		post: "Sales Representative",
		email: "dfalloona@ifeng.com",
		city: "Colima",
		start_date: "06/12/2018",
		salary: "$19252.12",
		attempted: "30",
		experience: "0 Year",
		status: 2,
	},
	{
		responsive_id: "",
		id: 12,
		avatar: "",
		full_name: "Cyrus Gornal",
		post: "Senior Sales Associate",
		email: "cgornalb@fda.gov",
		city: "Boro Utara",
		start_date: "12/09/2017",
		salary: "$16745.47",
		attempted: "22",
		score: "75%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 13,
		avatar: "",
		full_name: "Tallou Balf",
		post: "Staff Accountant",
		email: "tbalfc@sina.com.cn",
		city: "Siliana",
		start_date: "01/21/2016",
		salary: "$15488.53",
		attempted: "36",
		score: "95%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 14,
		avatar: "",
		full_name: "Othilia Extill",
		post: "Associate Professor",
		email: "oextilld@theatlantic.com",
		city: "Brzyska",
		start_date: "02/01/2016",
		salary: "$18442.34",
		attempted: "43",
		score: "80%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 15,
		avatar: "",
		full_name: "Wilmar Bourton",
		post: "Administrative Assistant",
		email: "wbourtone@sakura.ne.jp",
		city: "Bích Động",
		start_date: "04/25/2018",
		salary: "$13304.45",
		attempted: "19",
		score: "100%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 16,
		avatar: avatar4,
		full_name: "Robinson Brazenor",
		post: "General Manager",
		email: "rbrazenorf@symantec.com",
		city: "Gendiwu",
		start_date: "12/23/2017",
		salary: "$11953.08",
		attempted: "66",
		score: "95%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 17,
		avatar: "",
		full_name: "Nadia Bettenson",
		post: "Environmental Tech",
		email: "nbettensong@joomla.org",
		city: "Chabařovice",
		start_date: "07/11/2018",
		salary: "$20484.44",
		attempted: "64",
		score: "85%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 18,
		avatar: "",
		full_name: "Titus Hayne",
		post: "Web Designer",
		email: "thayneh@kickstarter.com",
		city: "Yangon",
		start_date: "05/25/2019",
		salary: "$16871.48",
		attempted: "59",
		score: "100%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 19,
		avatar: avatar5,
		full_name: "Roxie Huck",
		post: "Administrative Assistant",
		email: "rhucki@ed.gov",
		city: "Polýkastro",
		start_date: "04/04/2019",
		salary: "$19653.56",
		attempted: "41",
		score: "70%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 20,
		avatar: avatar7,
		full_name: "Latashia Lewtey",
		post: "Actuary",
		email: "llewteyj@sun.com",
		city: "Hougong",
		start_date: "08/03/2017",
		salary: "$18303.87",
		attempted: "35",
		score: "90%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 21,
		avatar: "",
		full_name: "Natalina Tyne",
		post: "Software Engineer",
		email: "ntynek@merriam-webster.com",
		city: "Yanguan",
		start_date: "03/16/2019",
		salary: "$15256.40",
		attempted: "30",
		experience: "0 Year",
		status: 1,
	},
	{
		responsive_id: "",
		id: 22,
		avatar: "",
		full_name: "Faun Josefsen",
		post: "Analog Circuit Design manager",
		email: "fjosefsenl@samsung.com",
		city: "Wengyang",
		start_date: "07/08/2017",
		salary: "$11209.16",
		attempted: "40",
		experience: "0 Year",
		status: 2,
	},
	{
		responsive_id: "",
		id: 23,
		avatar: avatar9,
		full_name: "Rosmunda Steed",
		post: "Assistant Media Planner",
		email: "rsteedm@xing.com",
		city: "Manzanares",
		start_date: "12/23/2017",
		salary: "$13778.34",
		attempted: "21",
		score: "70%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 24,
		avatar: "",
		full_name: "Scott Jiran",
		post: "Graphic Designer",
		email: "sjirann@simplemachines.org",
		city: "Pinglin",
		start_date: "05/26/2016",
		salary: "$23081.71",
		attempted: "23",
		score: "80%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 25,
		avatar: "",
		full_name: "Carmita Medling",
		post: "Accountant",
		email: "cmedlingo@hp.com",
		city: "Bourges",
		start_date: "07/31/2019",
		salary: "$13602.24",
		attempted: "47",
		score: "100%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 26,
		avatar: avatar2,
		full_name: "Morgen Benes",
		post: "Senior Sales Associate",
		email: "mbenesp@ted.com",
		city: "Cà Mau",
		start_date: "04/10/2016",
		salary: "$16969.63",
		attempted: "42",
		score: "75%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 27,
		avatar: "",
		full_name: "Onfroi Doughton",
		post: "Civil Engineer",
		email: "odoughtonq@aboutads.info",
		city: "Utrecht (stad)",
		start_date: "09/29/2018",
		salary: "$23796.62",
		attempted: "28",
		score: "100%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 28,
		avatar: "",
		full_name: "Kliment McGinney",
		post: "Chief Design Engineer",
		email: "kmcginneyr@paginegialle.it",
		city: "Xiaocheng",
		start_date: "07/09/2018",
		salary: "$24027.81",
		attempted: "28",
		score: "100%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 29,
		avatar: "",
		full_name: "Devin Bridgland",
		post: "Tax Accountant",
		email: "dbridglands@odnoklassniki.ru",
		city: "Baoli",
		start_date: "07/17/2016",
		salary: "$13508.15",
		attempted: "48",
		score: "100%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 30,
		avatar: avatar6,
		full_name: "Gilbert McFade",
		post: "Biostatistician",
		email: "gmcfadet@irs.gov",
		city: "Deje",
		start_date: "08/28/2018",
		salary: "$21632.30",
		attempted: "20",
		experience: "0 Year",
		status: 1,
	},
	{
		responsive_id: "",
		id: 31,
		avatar: "",
		full_name: "Teressa Bleakman",
		post: "Senior Editor",
		email: "tbleakmanu@phpbb.com",
		city: "Žebrák",
		start_date: "09/03/2016",
		salary: "$24875.41",
		attempted: "37",
		score: "100%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 32,
		avatar: "",
		full_name: "Marcelia Alleburton",
		post: "Safety Technician",
		email: "malleburtonv@amazon.com",
		city: "Basail",
		start_date: "06/02/2016",
		salary: "$23888.98",
		attempted: "53",
		score: "80%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 33,
		avatar: avatar7,
		full_name: "Aili De Coursey",
		post: "Environmental Specialist",
		email: "adew@etsy.com",
		city: "Łazy",
		start_date: "09/30/2016",
		salary: "$14082.44",
		attempted: "27",
		score: "100%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 34,
		avatar: avatar6,
		full_name: "Charlton Chatres",
		post: "Analyst Programmer",
		email: "cchatresx@goo.gl",
		city: "Reguengos de Monsaraz",
		start_date: "04/07/2016",
		salary: "$21386.52",
		attempted: "22",
		score: "75%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 35,
		avatar: avatar1,
		full_name: "Nat Hugonnet",
		post: "Financial Advisor",
		email: "nhugonnety@wufoo.com",
		city: "Pimentel",
		start_date: "09/11/2019",
		salary: "$13835.97",
		attempted: "46",
		score: "95%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 36,
		avatar: "",
		full_name: "Lorine Hearsum",
		post: "Payment Adjustment Coordinator",
		email: "lhearsumz@google.co.uk",
		city: "Shuiying",
		start_date: "03/05/2019",
		salary: "$22093.91",
		attempted: "47",
		score: "100%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 37,
		avatar: avatar8,
		full_name: "Sheila-kathryn Haborn",
		post: "Environmental Specialist",
		email: "shaborn10@about.com",
		city: "Lewolang",
		start_date: "11/10/2018",
		salary: "$24624.23",
		attempted: "51",
		score: "70%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 38,
		avatar: avatar3,
		full_name: "Alma Harvatt",
		post: "Administrative Assistant",
		email: "aharvatt11@addtoany.com",
		city: "Ulundi",
		start_date: "11/04/2016",
		salary: "$21782.82",
		attempted: "41",
		score: "70%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 39,
		avatar: avatar2,
		full_name: "Beatrix Longland",
		post: "VP Quality Control",
		email: "blongland12@gizmodo.com",
		city: "Damu",
		start_date: "07/18/2016",
		salary: "$22794.60",
		attempted: "62",
		score: "75%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 40,
		avatar: avatar4,
		full_name: "Hammad Condell",
		post: "Project Manager",
		email: "hcondell13@tiny.cc",
		city: "Bulung’ur",
		start_date: "11/04/2018",
		salary: "$10872.83",
		attempted: "37",
		score: "100%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 41,
		avatar: "",
		full_name: "Parker Bice",
		post: "Technical Writer",
		email: "pbice14@ameblo.jp",
		city: "Shanlian",
		start_date: "03/02/2016",
		salary: "$17471.92",
		attempted: "65",
		score: "90%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 42,
		avatar: "",
		full_name: "Lowrance Orsi",
		post: "Biostatistician",
		email: "lorsi15@wp.com",
		city: "Dengteke",
		start_date: "12/10/2018",
		salary: "$24719.51",
		attempted: "64",
		score: "85%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 43,
		avatar: avatar10,
		full_name: "Ddene Chaplyn",
		post: "Environmental Tech",
		email: "dchaplyn16@nymag.com",
		city: "Lattes",
		start_date: "01/23/2019",
		salary: "$11958.33",
		attempted: "38",
		score: "100%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 44,
		avatar: "",
		full_name: "Washington Bygraves",
		post: "Human Resources Manager",
		email: "wbygraves17@howstuffworks.com",
		city: "Zlaté Hory",
		start_date: "09/07/2016",
		salary: "$10552.43",
		attempted: "37",
		score: "100%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 45,
		avatar: avatar7,
		full_name: "Meghann Bodechon",
		post: "Operator",
		email: "mbodechon18@1und1.de",
		city: "Itō",
		start_date: "07/23/2018",
		salary: "$23024.28",
		attempted: "61",
		score: "70%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 46,
		avatar: avatar1,
		full_name: "Moshe De Ambrosis",
		post: "Recruiting Manager",
		email: "mde19@purevolume.com",
		city: "San Diego",
		start_date: "02/10/2018",
		salary: "$10409.90",
		attempted: "47",
		score: "100%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 47,
		avatar: avatar5,
		full_name: "Had Chatelot",
		post: "Cost Accountant",
		email: "hchatelot1a@usatoday.com",
		city: "Mercedes",
		start_date: "11/23/2016",
		salary: "$11446.30",
		attempted: "64",
		score: "85%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 48,
		avatar: "",
		full_name: "Georgia McCrum",
		post: "Registered Nurse",
		email: "gmccrum1b@icio.us",
		city: "Nggalak",
		start_date: "04/19/2018",
		salary: "$14002.31",
		attempted: "63",
		score: "80%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 49,
		avatar: avatar8,
		full_name: "Krishnah Stilldale",
		post: "VP Accounting",
		email: "kstilldale1c@chronoengine.com",
		city: "Slavs’ke",
		start_date: "03/18/2017",
		salary: "$10704.29",
		attempted: "56",
		score: "95%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 50,
		avatar: avatar4,
		full_name: "Mario Umbert",
		post: "Research Assistant",
		email: "mumbert1d@digg.com",
		city: "Chorotis",
		start_date: "05/13/2019",
		salary: "$21813.54",
		attempted: "43",
		score: "80%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 51,
		avatar: "",
		full_name: "Edvard Dixsee",
		post: "Graphic Designer",
		email: "edixsee1e@unblog.fr",
		city: "Rancharia",
		start_date: "04/23/2019",
		salary: "$18053.11",
		attempted: "46",
		score: "95%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 52,
		avatar: avatar9,
		full_name: "Tammie Davydoch",
		post: "VP Quality Control",
		email: "tdavydoch1f@examiner.com",
		city: "Mamedkala",
		start_date: "04/19/2016",
		salary: "$17617.08",
		attempted: "47",
		score: "100%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 53,
		avatar: "",
		full_name: "Benito Rodolico",
		post: "Safety Technician",
		email: "brodolico1g@sciencedirect.com",
		city: "Wonosobo",
		start_date: "10/06/2018",
		salary: "$18866.55",
		attempted: "21",
		score: "70%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 54,
		avatar: "",
		full_name: "Marco Pennings",
		post: "Compensation Analyst",
		email: "mpennings1h@bizjournals.com",
		city: "Umag",
		start_date: "06/15/2017",
		salary: "$13722.18",
		attempted: "30",
		experience: "0 Year",
		status: 2,
	},
	{
		responsive_id: "",
		id: 55,
		avatar: "",
		full_name: "Tommie O'Corr",
		post: "Quality Engineer",
		email: "tocorr1i@nyu.edu",
		city: "Olhos de Água",
		start_date: "09/26/2018",
		salary: "$15228.80",
		attempted: "51",
		score: "70%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 56,
		avatar: avatar1,
		full_name: "Cybill Poyle",
		post: "Cost Accountant",
		email: "cpoyle1j@amazon.com",
		city: "Hamm",
		start_date: "01/03/2016",
		salary: "$13951.96",
		attempted: "29",
		score: "100%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 57,
		avatar: avatar6,
		full_name: "Norry Stoller",
		post: "Human Resources Manager",
		email: "nstoller1k@noaa.gov",
		city: "Ruukki",
		start_date: "02/04/2018",
		salary: "$15100.00",
		attempted: "27",
		score: "100%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 58,
		avatar: "",
		full_name: "Wendi Somerlie",
		post: "Systems Administrator",
		email: "wsomerlie1l@accuweather.com",
		city: "Meicheng",
		start_date: "04/22/2016",
		salary: "$20023.52",
		attempted: "28",
		score: "100%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 59,
		avatar: "",
		full_name: "Ferdie Georgeon",
		post: "Geologist",
		email: "fgeorgeon1m@nhs.uk",
		city: "Tanahbeureum",
		start_date: "04/08/2019",
		salary: "$12630.26",
		attempted: "28",
		score: "70%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 60,
		avatar: "",
		full_name: "Jules Auten",
		post: "Desktop Support Technician",
		email: "jauten1n@foxnews.com",
		city: "Mojo",
		start_date: "08/13/2019",
		salary: "$13870.62",
		attempted: "48",
		score: "90%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 61,
		avatar: avatar3,
		full_name: "Nichole Dacres",
		post: "Mechanical Systems Engineer",
		email: "ndacres1o@apache.org",
		city: "Kimanuit",
		start_date: "11/06/2017",
		salary: "$18220.51",
		attempted: "20",
		experience: "0 Year",
		status: 2,
	},
	{
		responsive_id: "",
		id: 62,
		avatar: avatar1,
		full_name: "Holly Edgworth",
		post: "Junior Executive",
		email: "hedgworth1p@craigslist.org",
		city: "Pedreira",
		start_date: "08/05/2017",
		salary: "$13999.88",
		attempted: "37",
		experience: "0 Year",
		status: 2,
	},
	{
		responsive_id: "",
		id: 63,
		avatar: avatar9,
		full_name: "Henriette Croft",
		post: "Food Chemist",
		email: "hcroft1q@desdev.cn",
		city: "Taizhou",
		start_date: "09/12/2019",
		salary: "$11049.79",
		attempted: "53",
		score: "70%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 64,
		avatar: "",
		full_name: "Annetta Glozman",
		post: "Staff Accountant",
		email: "aglozman1r@storify.com",
		city: "Pendawanbaru",
		start_date: "08/25/2017",
		salary: "$10745.32",
		attempted: "27",
		score: "80%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 65,
		avatar: "",
		full_name: "Cletis Cervantes",
		post: "Health Coach",
		email: "ccervantes1s@de.vu",
		city: "Solnechnyy",
		start_date: "05/24/2018",
		salary: "$24769.08",
		attempted: "22",
		score: "100%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 66,
		avatar: avatar9,
		full_name: "Christos Kiley",
		post: "Geologist",
		email: "ckiley1t@buzzfeed.com",
		city: "El Bolsón",
		start_date: "02/27/2019",
		salary: "$16053.15",
		attempted: "46",
		score: "75%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 67,
		avatar: avatar7,
		full_name: "Silvain Siebert",
		post: "VP Sales",
		email: "ssiebert1u@domainmarket.com",
		city: "Cadiz",
		start_date: "09/23/2017",
		salary: "$23347.17",
		attempted: "47",
		score: "100%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 68,
		avatar: "",
		full_name: "Sharla Ibberson",
		post: "Payment Adjustment Coordinator",
		email: "sibberson1v@virginia.edu",
		city: "Lamam",
		start_date: "11/01/2016",
		salary: "$15658.40",
		attempted: "51",
		score: "100%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 69,
		avatar: avatar7,
		full_name: "Ripley Rentcome",
		post: "Physical Therapy Assistant",
		email: "rrentcome1w@youtu.be",
		city: "Dashkawka",
		start_date: "07/15/2018",
		salary: "$15396.66",
		attempted: "41",
		score: "100%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 70,
		avatar: "",
		full_name: "Chrisse Birrane",
		post: "Chemical Engineer",
		email: "cbirrane1x@google.com.br",
		city: "Las Toscas",
		start_date: "05/22/2016",
		salary: "$15823.40",
		attempted: "62",
		experience: "0 Year",
		status: 2,
	},
	{
		responsive_id: "",
		id: 71,
		avatar: "",
		full_name: "Georges Tesyro",
		post: "Human Resources Manager",
		email: "gtesyro1y@last.fm",
		city: "Gabao",
		start_date: "01/27/2019",
		salary: "$19051.25",
		attempted: "37",
		score: "100%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 72,
		avatar: "",
		full_name: "Bondon Hazard",
		post: "Geological Engineer",
		email: "bhazard1z@over-blog.com",
		city: "Llano de Piedra",
		start_date: "01/17/2019",
		salary: "$11632.84",
		attempted: "65",
		score: "80%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 73,
		avatar: avatar5,
		full_name: "Aliza MacElholm",
		post: "VP Sales",
		email: "amacelholm20@printfriendly.com",
		city: "Sosnovyy Bor",
		start_date: "11/17/2017",
		salary: "$16741.31",
		attempted: "64",
		score: "100%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 74,
		avatar: avatar2,
		full_name: "Lucas Witherdon",
		post: "Senior Quality Engineer",
		email: "lwitherdon21@storify.com",
		city: "Staré Křečany",
		start_date: "09/26/2016",
		salary: "$19387.76",
		attempted: "38",
		score: "75%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 75,
		avatar: "",
		full_name: "Pegeen Peasegod",
		post: "Web Designer",
		email: "ppeasegod22@slideshare.net",
		city: "Keda",
		start_date: "05/21/2016",
		salary: "$24014.04",
		attempted: "59",
		score: "95%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 76,
		avatar: "",
		full_name: "Elyn Watkinson",
		post: "Structural Analysis Engineer",
		email: "ewatkinson23@blogspot.com",
		city: "Osan",
		start_date: "09/30/2016",
		salary: "$14493.51",
		attempted: "55",
		score: "100%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 77,
		avatar: avatar10,
		full_name: "Babb Skirving",
		post: "Analyst Programmer",
		email: "bskirving24@cbsnews.com",
		city: "Balky",
		start_date: "09/27/2016",
		salary: "$24733.28",
		attempted: "39",
		score: "70%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 78,
		avatar: "",
		full_name: "Shelli Ondracek",
		post: "Financial Advisor",
		email: "sondracek25@plala.or.jp",
		city: "Aoluguya Ewenke Minzu",
		start_date: "03/28/2016",
		salary: "$21922.17",
		attempted: "23",
		score: "70%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 79,
		avatar: avatar9,
		full_name: "Stanislaw Melloy",
		post: "Sales Associate",
		email: "smelloy26@fastcompany.com",
		city: "Funafuti",
		start_date: "04/13/2017",
		salary: "$16944.42",
		attempted: "30",
		score: "75%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 80,
		avatar: "",
		full_name: "Seamus Eisikovitsh",
		post: "Legal Assistant",
		email: "seisikovitsh27@usgs.gov",
		city: "Cangkringan",
		start_date: "05/28/2018",
		salary: "$21963.69",
		attempted: "22",
		score: "100%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 81,
		avatar: avatar2,
		full_name: "Tammie Wattins",
		post: "Web Designer",
		email: "twattins28@statcounter.com",
		city: "Xilin",
		start_date: "08/07/2018",
		salary: "$16049.93",
		attempted: "36",
		score: "90%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 82,
		avatar: avatar8,
		full_name: "Aila Quailadis",
		post: "Technical Writer",
		email: "aquail29@prlog.org",
		city: "Shuangchahe",
		start_date: "02/11/2018",
		salary: "$24137.29",
		attempted: "43",
		score: "85%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 83,
		avatar: "",
		full_name: "Myrvyn Gilogly",
		post: "Research Associate",
		email: "mgilogly2a@elpais.com",
		city: "Prince Rupert",
		start_date: "05/13/2018",
		salary: "$10089.96",
		attempted: "19",
		score: "100%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 84,
		avatar: avatar5,
		full_name: "Hanna Langthorne",
		post: "Analyst Programmer",
		email: "hlangthorne2b@stumbleupon.com",
		city: "Guaynabo",
		start_date: "11/11/2018",
		salary: "$14227.10",
		attempted: "21",
		score: "100%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 85,
		avatar: "",
		full_name: "Ruby Gimblet",
		post: "Registered Nurse",
		email: "rgimblet2c@1688.com",
		city: "Nanyulinxi",
		start_date: "03/28/2016",
		salary: "$19562.59",
		attempted: "30",
		score: "70%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 86,
		avatar: avatar4,
		full_name: "Louis Paszak",
		post: "Programmer",
		email: "lpaszak2d@behance.net",
		city: "Chiscas",
		start_date: "04/25/2016",
		salary: "$17178.86",
		attempted: "51",
		score: "100%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 87,
		avatar: "",
		full_name: "Glennie Riolfi",
		post: "Computer Systems Analyst",
		email: "griolfi2e@drupal.org",
		city: "Taung",
		start_date: "06/18/2018",
		salary: "$15089.83",
		attempted: "29",
		score: "85%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 88,
		avatar: "",
		full_name: "Jemimah Morgan",
		post: "Staff Accountant",
		email: "jmorgan2f@nifty.com",
		city: "La Esperanza",
		start_date: "01/17/2016",
		salary: "$18330.72",
		attempted: "27",
		score: "80%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 89,
		avatar: avatar10,
		full_name: "Talya Brandon",
		post: "Food Chemist",
		email: "tbrandon2g@ucoz.com",
		city: "Zaječar",
		start_date: "10/08/2018",
		salary: "$16284.64",
		attempted: "28",
		score: "95%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 90,
		avatar: avatar6,
		full_name: "Renate Shay",
		post: "Recruiter",
		email: "rshay2h@tumblr.com",
		city: "Pueblo Viejo",
		start_date: "03/15/2017",
		salary: "$18523.75",
		attempted: "28",
		score: "80%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 91,
		avatar: "",
		full_name: "Julianne Bartosik",
		post: "Senior Cost Accountant",
		email: "jbartosik2i@state.gov",
		city: "Botlhapatlou",
		start_date: "02/06/2017",
		salary: "$17607.66",
		attempted: "48",
		score: "95%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 92,
		avatar: avatar3,
		full_name: "Yvonne Emberton",
		post: "Recruiter",
		email: "yemberton2j@blog.com",
		city: "Nagcarlan",
		start_date: "02/13/2017",
		salary: "$17550.18",
		attempted: "20",
		score: "70%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 93,
		avatar: avatar8,
		full_name: "Danya Faichnie",
		post: "Social Worker",
		email: "dfaichnie2k@weather.com",
		city: "Taling",
		start_date: "07/29/2019",
		salary: "$18469.35",
		attempted: "37",
		score: "80%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 94,
		avatar: "",
		full_name: "Ronica Hasted",
		post: "Software Consultant",
		email: "rhasted2l@hexun.com",
		city: "Gangkou",
		start_date: "07/04/2019",
		salary: "$24866.66",
		attempted: "53",
		score: "100%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 95,
		avatar: avatar2,
		full_name: "Edwina Ebsworth",
		post: "Human Resources Assistant",
		email: "eebsworth2m@sbwire.com",
		city: "Puzi",
		start_date: "09/27/2018",
		salary: "$19586.23",
		attempted: "27",
		score: "75%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 96,
		avatar: "",
		full_name: "Alaric Beslier",
		post: "Tax Accountant",
		email: "abeslier2n@zimbio.com",
		city: "Ocucaje",
		start_date: "04/16/2017",
		salary: "$19366.53",
		attempted: "22",
		score: "100%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 97,
		avatar: "",
		full_name: "Reina Peckett",
		post: "Quality Control Specialist",
		email: "rpeckett2o@timesonline.co.uk",
		city: "Anyang",
		start_date: "05/20/2018",
		salary: "$16619.40",
		attempted: "46",
		score: "100%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 98,
		avatar: avatar7,
		full_name: "Olivette Gudgin",
		post: "Paralegal",
		email: "ogudgin2p@gizmodo.com",
		city: "Fujinomiya",
		start_date: "04/09/2019",
		salary: "$15211.60",
		attempted: "47",
		score: "100%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 99,
		avatar: avatar10,
		full_name: "Evangelina Carnock",
		post: "Cost Accountant",
		email: "ecarnock2q@washington.edu",
		city: "Doushaguan",
		start_date: "01/26/2017",
		salary: "$23704.82",
		attempted: "51",
		experience: "0 Year",
		status: 1,
	},
	{
		responsive_id: "",
		id: 100,
		avatar: "",
		full_name: "Glyn Giacoppo",
		post: "Software Test Engineer",
		email: "ggiacoppo2r@apache.org",
		city: "Butha-Buthe",
		start_date: "04/15/2017",
		salary: "$24973.48",
		attempted: "41",
		score: "100%",
		status: 1,
	},
];

export const dataLogCourse = [
	{
		responsive_id: "",
		id: 1,
		avatar: avatar10,
		full_name: "Korrie O'Crevy",
		course: "Introduction to Web Development",
		email: "kocrevy0@thetimes.co.uk",
		section: "Getting Started",
		start_date: "09/23/2016",
		lesson: "Setting Up Development Environment",
		avg_final: "1%",
		avg_quiz: "0%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 2,
		avatar: avatar1,
		full_name: "Bailie Coulman",
		course: "Introduction to Web Development",
		email: "bcoulman1@yolasite.com",
		section: "Getting Started",
		start_date: "05/20/2018",
		lesson: "Setting Up Development Environment",
		avg_final: "1%",
		avg_quiz: "0%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 3,
		avatar: avatar9,
		full_name: "Stella Ganderton",
		course: "Introduction to Web Development",
		email: "sganderton2@tuttocitta.it",
		section: "Getting Started",
		start_date: "03/24/2018",
		lesson: "Setting Up Development Environment",
		avg_final: "1%",
		avg_quiz: "0%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 4,
		avatar: avatar10,
		full_name: "Dorolice Crossman",
		course: "Machine Learning Basics",
		email: "dcrossman3@google.co.jp",
		section: "Getting Started",
		start_date: "12/03/2017",
		lesson: "Setting Up Development Environment",
		avg_final: "1%",
		avg_quiz: "0%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 5,
		avatar: "",
		full_name: "Harmonia Nisius",
		course: "Python for Beginners",
		email: "hnisius4@gnu.org",
		section: "Getting Started",
		start_date: "08/25/2017",
		lesson: "Setting Up Development Environment",
		avg_final: "1%",
		avg_quiz: "0%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 6,
		avatar: "",
		full_name: "Genevra Honeywood",
		course: "Introduction to Web Development",
		section: "Getting Started",
		city: "Maofan",
		start_date: "06/01/2017",
		lesson: "Setting Up Development Environment",
		avg_final: "1%",
		avg_quiz: "0%",
		status: 2,
	},
	{
		responsive_id: "",
		id: 7,
		avatar: "",
		full_name: "Eileen Diehn",
		course: "Python for Beginners",
		email: "ediehn6@163.com",
		section: "Getting Started",
		start_date: "10/15/2017",
		lesson: "Setting Up Development Environment",
		avg_final: "1%",
		avg_quiz: "0%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 8,
		avatar: avatar9,
		full_name: "Richardo Aldren",
		course: "React.js Crash Course",
		email: "raldren7@mtv.com",
		section: "Getting Started",
		start_date: "11/05/2016",
		lesson: "Setting Up Development Environment",
		avg_final: "1%",
		avg_quiz: "0%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 9,
		avatar: avatar2,
		full_name: "Allyson Moakler",
		course: "Machine Learning Basics",
		email: "amoakler8@shareasale.com",
		section: "Getting Started",
		start_date: "12/29/2018",
		lesson: "Setting Up Development Environment",
		avg_final: "1%",
		avg_quiz: "0%",
		status: 1,
	},
	{
		responsive_id: "",
		id: 10,
		avatar: avatar9,
		full_name: "Merline Penhalewick",
		course: "Introduction to Web Development",
		email: "mpenhalewick9@php.net",
		section: "Getting Started",
		start_date: "04/19/2019",
		lesson: "Setting Up Development Environment",
		avg_final: "1%",
		avg_quiz: "0%",
		status: 1,
	},
];
export const columns = [
	{
		name: "Name",
		minWidth: "250px",
		sortable: (row) => (row?.name ? row.name : false),
		cell: (row) => (
			<div className="d-flex align-items-center">
				{!row.avatar ? (
					<Avatar
						color={
							row.minGrade <= row.score
								? "light-success"
								: "light-danger"
						}
						content={row?.name ? row.name : row.email}
						initials
					/>
				) : (
					<Avatar img={row.avatar} />
				)}
				<div className="user-info text-truncate ms-1">
					<span className="d-block fw-bold text-truncate">
						{row?.name}
					</span>
					<small>{row.email}</small>
				</div>
			</div>
		),
	},
	{
		name: "Score",
		sortable: (row) => row.score,
		minWidth: "150px",
		selector: (row) => row.score,
	},
	{
		name: "Status",
		minWidth: "150px",
		sortable: true,
		cell: (row) => {
			return (
				<Badge
					color={
						row.minGrade <= row.score
							? "light-success"
							: "light-danger"
					}
					pill
				>
					{row.minGrade <= row.score ? "Passed" : "Failed"}
				</Badge>
			);
		},
	},
	// {
	// 	name: "Attempted",
	// 	sortable: true,
	// 	minWidth: "150px",
	// 	selector: (row) => row.attempted,
	// },
	{
		name: "Date",
		sortable: true,
		minWidth: "150px",
		selector: (row) => {
			const timestamp = dayjs
				.unix(row.timestamp.seconds)
				.format("YYYY-MM-DD HH:mm:ss");
			return dateTimeFormat(timestamp);
			// 	dateTimeFormat(row.timestamp)
		},
	},
	// {
	// 	name: "Actions",
	// 	allowOverflow: true,
	// 	cell: () => {
	// 		return (
	// 			<div className="d-flex">
	// 				<UncontrolledDropdown>
	// 					<DropdownToggle className="pe-1" tag="span">
	// 						<MoreVertical size={15} />
	// 					</DropdownToggle>
	// 					<DropdownMenu end>
	// 						<DropdownItem
	// 							tag="a"
	// 							href="/"
	// 							className="w-100"
	// 							onClick={(e) => e.preventDefault()}
	// 						>
	// 							<FileText size={15} />
	// 							<span className="align-middle ms-50">
	// 								Details
	// 							</span>
	// 						</DropdownItem>
	// 						<DropdownItem
	// 							tag="a"
	// 							href="/"
	// 							className="w-100"
	// 							onClick={(e) => e.preventDefault()}
	// 						>
	// 							<Archive size={15} />
	// 							<span className="align-middle ms-50">
	// 								Archive
	// 							</span>
	// 						</DropdownItem>
	// 						<DropdownItem
	// 							tag="a"
	// 							href="/"
	// 							className="w-100"
	// 							onClick={(e) => e.preventDefault()}
	// 						>
	// 							<Trash size={15} />
	// 							<span className="align-middle ms-50">
	// 								Delete
	// 							</span>
	// 						</DropdownItem>
	// 					</DropdownMenu>
	// 				</UncontrolledDropdown>
	// 				<Edit size={15} />
	// 			</div>
	// 		);
	// 	},
	// },
];
export const columnsLogCourse = [
	{
		name: "Name",
		minWidth: "250px",
		sortable: (row) => (row?.name ? row.name : false),
		cell: (row) => (
			<div className="d-flex align-items-center">
				{!row.avatar ? (
					<Avatar
						color={
							row.minGrade <= row.score
								? "light-success"
								: "light-danger"
						}
						content={row?.name ? row.name : row.email}
						initials
					/>
				) : (
					<Avatar img={row.avatar} />
				)}
				<div className="user-info text-truncate ms-1">
					<span className="d-block fw-bold text-truncate">
						{row?.name}
					</span>
					<small>{row.email}</small>
				</div>
			</div>
		),
	},
	{
		name: "Lesson",
		sortable: true,
		minWidth: "150px",
		selector: (row) => row.lesson_title,
	},
	{
		name: "Section",
		sortable: true,
		minWidth: "150px",
		selector: (row) => row.section_title,
	},
	{
		name: "Course",
		sortable: true,
		minWidth: "150px",
		selector: (row) => row.course,
	},
	{
		name: "Date",
		sortable: true,
		minWidth: "150px",
		selector: (row) => {
			const timestamp = dayjs
				.unix(row.lastUpdated.seconds)
				.format("YYYY-MM-DD HH:mm:ss");
			return dateTimeFormat(timestamp);
			// 	dateTimeFormat(row.timestamp)
		},
	},
	// {
	// 	name: "Status",
	// 	minWidth: "150px",
	// 	sortable: (row) => row.status.title,
	// 	cell: (row) => {
	// 		return (
	// 			<Badge color={status[row.status].color} pill>
	// 				{status[row.status].title}
	// 			</Badge>
	// 		);
	// 	},
	// },
];

const columnsDetailAttendance = [
	{
		name: "Name",
		minWidth: "250px",
		sortable: false,
		selector: (row) => row?.name ? row?.name : '',
		cell: (row) => (
			<div className="d-flex align-items-center">
				{console.log(row, "roq")}
				{!row?.userReq?.avatar ? (
					<Avatar
						content={row?.name ? row?.name : row?.email ? row?.email : ''}
						initials
					/>
				) : (
					<Avatar img={row?.avatar} />
				)}
				<div className="user-info text-truncate ms-1">
					<span className="d-block fw-bold text-truncate">
						{row?.name}
					</span>
					<small>{row?.email}</small>
				</div>
			</div>
		),
	},
	{
		name: "Employee No",
		sortable: false,
		minWidth: "150px",
		selector: (row) => row?.nip ? row?.nip : '',
	},
	{
		name: "Department",
		sortable: false,
		minWidth: "150px",
		selector: (row) => row?.departement ? row?.departement : '',
	},
	{
		name: "Clock In",
		sortable: true,
		minWidth: "150px",
		selector: (row) => row?.clock_in ? row?.clock_in : '',
	},
	{
		name: "Clock Out",
		sortable: true,
		minWidth: "150px",
		selector: (row) => row?.clock_out ? row?.clock_out : '',
	},
	{
		name: "Late",
		sortable: true,
		minWidth: "150px",
		selector: (row) => row?.late_count ? row?.late_count : '',
	},
]

export const columnsAttendance = [{
	name: "Name",
	minWidth: "250px",
	sortable: true,
	selector: (row) => row?.userReq?.name ? row?.userReq?.name : '',
	cell: (row) => (
		<div className="d-flex align-items-center">
			{console.log(row, 'nirow')}
			{!row?.userReq?.avatar ? (
				<Avatar
					content={row?.userReq?.name ? row?.userReq?.name : row?.userReq?.email ? row?.userReq?.email : ''}
					initials
				/>
			) : (
				<Avatar img={row?.userReq?.avatar} />
			)}
			<div className="user-info text-truncate ms-1">
				<span className="d-block fw-bold text-truncate">
					{row?.userReq?.name}
				</span>
				<small>{row?.userReq?.email}</small>
			</div>
		</div>
	),
},
{
	name: "Employee No",
	sortable: true,
	minWidth: "150px",
	selector: (row) => row?.userReq?.nip ? row?.userReq?.nip : '',
},
{
	name: "Department",
	sortable: true,
	minWidth: "150px",
	selector: (row) => row?.userReq?.departement?.name ? row?.userReq?.departement?.name : '',
},
{
	name: "Total Attendance",
	sortable: true,
	minWidth: "150px",
	selector: (row) => row?.total_attendance ? row?.total_attendance : '',
},
{
	name: "Attendance Log",
	sortable: false,
	minWidth: "150px",
	cell: (row) => {
		const [toggleModal, setToggleModal] = useState(false)
		const [attendanceLog, setAttendanceLog] = useState({})
		let arr = []

		row.attendances.map((x) =>
			arr.push({ ...x, nip: row?.userReq?.nip, name: row?.userReq?.name, email: row?.userReq?.email, avatar: row?.userReq?.avatar, departement: row?.userReq?.departement?.name })
		)

		const onModal = () => {
			setToggleModal(true)
			setAttendanceLog(arr)
		}

		return (
			<div className="d-flex align-items-center">
				<a className="text-primary" onClick={onModal}>See Details</a>

				<Modal
					isOpen={toggleModal}
					toggle={() => setToggleModal(!toggleModal)}
					className={`modal-dialog-centered modal-xl`}
				>
					<ModalHeader toggle={() => setToggleModal(!toggleModal)}>
						Attendance Log
					</ModalHeader>
					<ModalBody>
						<DataTable
							data={attendanceLog}
							columns={columnsDetailAttendance}
						/>

						<Col>
							<Button
								type="button"
								size="md"
								color="danger"
								className="mt-1"
								onClick={() => setToggleModal(!toggleModal)}
							>
								Close
							</Button>

						</Col>
					</ModalBody>
				</Modal >
			</div>
		)
	},
},
]

export const columnsScore = [{
	name: "Course",
	sortable: true,
	minWidth: "150px",
	selector: (row) => row?.course?.course_title,
	cell: (row) => (
		<div className="d-flex align-items-center">
			{!row.course?.course_thumbnail ? (
				<Avatar
					content={row?.course?.course_title}
					initials
				/>
			) : (
				<Avatar img={row?.course?.course_thumbnail} />
			)}
			<div className="user-info text-truncate ms-1">
				<span className="d-block fw-bold text-truncate">
					{row?.course?.course_title}
				</span>

			</div>
		</div>
	),
},
{
	name: "Section",
	sortable: true,
	minWidth: "150px",
	selector: (row) => row?.section_title,
}, {
	name: "Lesson",
	sortable: true,
	minWidth: "150px",
	selector: (row) => row?.lesson_title,
}, {
	name: "Score",
	// sortable: true,
	minWidth: "150px",
	// selector: (row) => 
	cell: (row) => {
		const score = row?.scores?.find(score => score.uid === uid)
		// console.log(neweee, 'nenew', uid)
		return (
			<div className="d-flex align-items-center">

				<Badge
					color={
						score?.score >= row?.quiz_minGrade
							? "light-success"
							: "light-danger"
					}
					pill
				>
					{score?.score}
				</Badge>
			</div>
		)
	},
}]

export const columnsFormBuilder = [{
	name: "Form Title",
	sortable: true,
	minWidth: "150px",
	selector: (row) => row?.title,
	cell: (row) => {

		// console.log(neweee, 'nenew', uid)
		return (
			<div className="d-flex align-items-center">
				<a href={`/form-builder/${row.id}`}>{row?.title}</a>
			</div>
		)
	},
}, {
	name: "Created At",
	sortable: true,
	minWidth: "150px",
	selector: (row) => row?.createdAt,
	cell: (row) => {
		// const timestamp = dayjs
		// 	.unix(row.createdAt)
		// 	.format("YYYY-MM-DD HH:mm:ss");
		return (row.createdAt)
	}
},
{
	name: "Actions",
	sortable: true,
	minWidth: "150px",
	selector: (row) => row?.title,
	cell: (row) => {


		console.log(row, 'nenew')
		const location = () => {
			window.location.href = `/form-builder/${row?.id}`
		}

		const handleDeleteForm = () => {
			return MySwal.fire({
				title: "Are you sure?",
				text: "You won't be able to revert this!",
				icon: "warning",
				showCancelButton: true,
				confirmButtonText: "Yes, delete it!",
				customClass: {
					confirmButton: "btn btn-primary",
					cancelButton: "btn btn-outline-danger ms-1",
				},
				buttonsStyling: false,
			}).then(function async(result) {
				console.log(result, 'mm')
				if (result.value) {
					Api.delete(`/hris/form-builder/${row.id}`)

					MySwal.fire({
						icon: "success",
						title: "Deleted!",
						text: "Your form has been deleted.",
						customClass: {
							confirmButton: "btn btn-success",
						},
					});
				}

			})
		}

		return (
			<Fragment>

				<Button.Ripple className='btn-icon' color='warning' onClick={() => location()} >
					<Edit size={16} />
				</Button.Ripple>
				<Button.Ripple className='btn-icon ms-1' color='danger' onClick={() => handleDeleteForm()} >
					<Trash size={16} />
				</Button.Ripple>
			</Fragment>
		)
	},
},]