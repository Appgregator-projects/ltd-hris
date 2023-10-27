import { Fragment } from "react";
import { UncontrolledTooltip } from "reactstrap";
import Avatar from "../../../../@core/components/avatar";
// import Avatar from "../avatar";

const AvatarGroup = ({ data, id }) => {
     const newData = data?.name.replace(/[.&\/^$*#@!%+=?()\[\]{},<>\|]/g, "");
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
				img={data?.image ? data.image : false}
				content={data?.name}
				id={newData?.split(" ").join("-").toLowerCase()}
				meta={undefined}
				title={data?.name}
				initials
			/>
		</Fragment>
	);
};
export default AvatarGroup;
