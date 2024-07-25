import platinumBadge from "../assets/platinumMedal.svg";
import goldBadge from "../assets/goldMedal.svg";
import silverBadge from "../assets/silverMedal.svg";
import bronzeBadge from "../assets/bronzeMedal.svg";

const tierBadge = (tier) => {
	if (tier == "Gold") return goldBadge;
	else if (tier == "Silver") return silverBadge;
	else if (tier == "Bronze") return bronzeBadge;
	else return platinumBadge;
};

const GridDataColumn = ({ name, id, bounty, birthday, role, tier }) => {
	const badge = tierBadge(tier);
	return (
		<div className="listDataSet">
			{/* <div className="employeeId">
                {id}
            </div> */}
			<div className="employeeID">{id}</div>
			<div className="employeeName">{name}</div>
			<div className="employeeBirthday">{birthday}</div>
			<div className="employeePhone">{role}</div>
			<div className="employeeBounty">{bounty} Kyns</div>
			{/* <div className="employeeTier"> */}
			<img className="tierBadge" src={badge} />
			{/* </div> */}
		</div>
	);
};
export default GridDataColumn;
