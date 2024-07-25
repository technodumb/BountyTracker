import { useEffect, useState } from "react";
import "./ReviewPage.styles.scss";
import ParticipantContribution from "../../components/ParticipantContribution/ParticipantContribution";
import { useCompleteTaskMutation, useGetTaskContributionsQuery, useLazyDownloadFileQuery } from "../../api/taskApi";
import { useNavigate, useNavigation, useParams } from "react-router-dom";
import CustomModal from "../../components/Modal/CustomModal";
import { useDispatch } from "react-redux";
import { addToastMessage } from "../../store/toastReducer";
import { v4 } from "uuid";
import { createToastError } from "../../utils/createToastError";
import Button from "../../components/Button/Button";

const ReviewPage = () => {
	const [participantList, setParticipantList] = useState([]);
	const [remainingBounty, setRemainingBounty] = useState(0);
	const dispatch = useDispatch();
	const [taskDetails, setTaskDetails] = useState({
		name: "",
		id: "",
		description: "",
	});

	useEffect(() => {
		const bountySum = participantList.reduce((tot, participant) => tot + parseInt(participant.rewardedBounty), 0);
		setRemainingBounty(taskDetails.totalBounty - bountySum);
	}, [participantList, taskDetails.totalBounty]);

	const [expandedIndex, setExpandedIndex] = useState(-1);
	const [showContributionModal, setShowContributionModal] = useState();

	const { taskId } = useParams();

	const handleExpand = (index) => setExpandedIndex((prev) => (prev !== index ? index : -1));

	const { data: contributionData, isSuccess } = useGetTaskContributionsQuery(parseInt(taskId));
	const [completeTask] = useCompleteTaskMutation();
	const navigate = useNavigate();
	const handleContributeConfirm = async () => {
		if (remainingBounty > 0) {
			dispatch(
				addToastMessage({
					id: v4(),
					status: "error",
					message: `You still have ${remainingBounty} Bounty left to distribute`,
				}),
			);
		} else if (remainingBounty < 0) {
			createToastError(dispatch, `You have exceeded the maximum distributable bounty by ${-remainingBounty}`);
		} else {
			const participantContributions = participantList.map((participant) => ({
				employeeId: participant.id,
				rewardedBounty: participant.rewardedBounty,
			}));
			// console.log(participantContributions);
			navigate(`/tasks/${taskId}`);
			await completeTask({ taskId, participantContributions })
				.then(() => {
					navigate(`/tasks/${taskId}`);
				})
				.catch((error) => {
					createToastError(dispatch, error);
				});

			// TODO: logic to submit user bounty
		}
	};

	useEffect(() => {
		if (isSuccess) {
			const participantListReceived = contributionData.data.participants;
			const participantListUpdated = participantListReceived.map((participant) => {
				return { ...participant, rewardedBounty: 0 };
			});

			setTaskDetails({
				name: contributionData.data.name,
				id: contributionData.data.id,
				description: contributionData.data.description,
				totalBounty: contributionData.data.totalBounty,
			});
			setParticipantList(participantListUpdated);
		}
	}, [contributionData, isSuccess]);

	const handleContributionModal = (contributionData) => {
		setShowContributionModal(contributionData);
	};

	const handleSplitEvenly = () => {
		const splitBounty = parseInt(taskDetails.totalBounty / participantList.length);
		let remainingBounty = taskDetails.totalBounty % participantList.length;
		const updatedValues = [];
		for (let i = 0; i < participantList.length; i++) {
			updatedValues.push(splitBounty + (remainingBounty-- > 0));
		}
		setParticipantList((prev) => {
			const newList = [...prev].map((participant, index) => {
				participant.rewardedBounty = updatedValues[index];
				return participant;
			});
			return newList;
		});
	};

	const downloadFileHandler = (id) => {
		window.open(`http://localhost:3000/tasks/comments/${id}/file`);
	};

	return (
		<div className="ReviewPage">
			{showContributionModal && (
				<CustomModal
					handleCancel={() => setShowContributionModal(false)}
					hideButtons={true}
					title="Contribution Info"
				>
					<span>{showContributionModal.content}</span>
					<span>
						{/* Attachment: {showContributionModal.fileUrl ? showContributionModal.fileUrl : "No Attachment"} */}
						Attachment:{" "}
						{showContributionModal.fileUrl ? (
							<button onClick={() => downloadFileHandler(showContributionModal.id)}>Download</button>
						) : (
							"No Attachment"
						)}
					</span>
				</CustomModal>
			)}
			{/* {isLoading && <Loader />} */}
			<div className="wrapHeading">
				<div>Review Task</div>
				{/* <div className="split">
						Split Equally */}
					
					{/* </div> */}
			</div>

			<main className="reviewMain">
				<section className="taskDetails">
					<span className="taskDetailsHeader">
						<h2 className="taskTitle">{`Task: ${taskDetails.name}`}</h2>
						<h2 className="taskId">{`Task #${taskDetails.id}`}</h2>
					</span>
					<div className="taskdetails">{`${taskDetails.description}`}</div>
					<div className="footer">
						<div className="Total Bounty"> {`Total Bounty: ${taskDetails.totalBounty}`}</div>
						<div className="Remaining Bounty">{`Remaining Bounty: ${remainingBounty}`}</div>
					</div>
				</section>
			
				<section className="contributionSection">
				<div className="contributionHeading">
					<div className="participantcont">Participant Contributions</div>
					<Button
								text="Split Equally"
								isPrimary={true}
								onClick={handleSplitEvenly}
			
							/> 

				</div>
					{isSuccess &&
						participantList.map((participant, index) => (
							<ParticipantContribution
								key={participant.id}
								participant={participant}
								isExpanded={index === expandedIndex}
								onClick={() => handleExpand(index)}
								handleContributionModal={handleContributionModal}
								handleChangeBounty={(e) => {
									let bounty = parseInt(e.target.value);
									if (e.target.value === "") bounty = 0;
									if (bounty >= 0) {
										setParticipantList((prev) => {
											const newList = [...prev];
											newList[index].rewardedBounty = bounty;
											return newList;
										});
									}
								}}
							/>
						))}
				</section>
				<div className="confirm" onClick={handleContributeConfirm}>
					Confirm
				</div>
			</main>
		</div>
	);
};

export default ReviewPage;
