import { Fragment } from "react";
import { UncontrolledTooltip } from "reactstrap";
import Avatar from "../avatar";

const SingleAvatarGroup = ({ data, id }) => {
     const newData = data?.label.replace(/[.&\/^$*#@!%+=?()\[\]{},<>\|]/g, "");
	return (
		<Fragment key={id}>
			<UncontrolledTooltip
				placement="top"
				target={newData?.split(" ").join("-").toLowerCase()}
			>
				{data?.label}
			</UncontrolledTooltip>
			<Avatar
				className="pull-up"
				img={data?.avatar ? data.avatar : false}
				content={data?.label}
				id={newData?.split(" ").join("-").toLowerCase()}
				meta={undefined}
				title={undefined}
				initials
			/>
		</Fragment>
	);
};
export default SingleAvatarGroup;
