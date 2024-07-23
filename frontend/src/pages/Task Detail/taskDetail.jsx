/* eslint-disable react/jsx-key */
import "./styles.scss";
import logo from "../../assets/KoYns-Logo.png";
import commentIcon from "../../assets/commentIcon.svg";
import attach from "../../assets/attach.svg";
import profile from "../../assets/profile.png";
import send from "../../assets/send.svg";
import Button from "../../components/Button/Button";
import { useEffect, useRef, useState } from "react";
import {
	useCreateCommentMutation,
	useGetCommentsByTaskIdQuery,
	useGetTaskByIdQuery,
	useJoinTaskMutation,
	useLazyGetTaskByIdQuery,
} from "../../api/taskApi";
import { formatDate } from "../../utils/date.utils";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addJoinedStatus } from "../../store/employeeReducer";
import CustomModal from "../../components/Modal/CustomModal";
import CommentComponent from "../../components/CommentComponent/CommentComponent";
const TaskDetail = () => {
	const [commentList, setCommentList] = useState([]);
	const [participantList, setParticipantList] = useState([]);
	const [joined, setJoined] = useState(false);
	const [file, uploadFile] = useState();
	const [showContributionModal, setShowContributionModal] = useState(false);
	const [comment, setComment] = useState("");
	const [contribution, setContribution] = useState("");
	const [mentionId, setMentionId] = useState();

	const { taskId } = useParams();
	const inputRef = useRef();
	const dispatch = useDispatch();

	const [getTaskById, { data: taskDetail, isSuccess: taskSuccess }] = useLazyGetTaskByIdQuery();
	const { data: commentsData, isSuccess: commentSuccess } = useGetCommentsByTaskIdQuery(taskId);
	const [join, { isSuccess: joinSuccess }] = useJoinTaskMutation();
	const [createComment] = useCreateCommentMutation();

	const loggedState = useSelector((state) => state.employee);

	const form_fields = [
		{
			id: "description",
			name: "Description",
			value: taskDetail?.description,
		},

		{
			id: "skills",
			name: "Skills",
			value: taskDetail?.skillList,
		},
	];

	const handleSend = async () => {
		const formData = new FormData();
		formData.append("commentType", "Normal");
		formData.append("content", comment);
		if (mentionId) formData.append("mentionCommentId", mentionId);
		createComment({ taskId, formData });
		setComment("");
	};
	const handleTextArea = (e) => {
		setComment(e.target.value);
	};
	const handleUpload = (e) => {
		uploadFile(e.target.files[0]);
	};
	const handleReply = (id) => {
		inputRef.current.focus();
		setMentionId(id);
	};
	const handleJoin = () => {
		join(taskId);
	};

	const handleSubmitReview = () => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("commentType", "Review");
		formData.append("content", contribution);
		createComment({ taskId, formData });
		setContribution("");
	};

	useEffect(() => {
		if (taskSuccess) {
			console.log("effect 1");
			const participants = taskDetail.data.participants;
			setParticipantList(participants);
			participants.forEach((participant) => {
				if (participant.id === loggedState.id) {
					// dispatch(addJoinedStatus({ id: taskId, status: "joined" }));
					setJoined(true);
				}
			});
		}
	}, [taskSuccess, loggedState.status, taskDetail, loggedState.id]);

	useEffect(() => {
		getTaskById(taskId);
		if (joinSuccess) {
			console.log("effect 2");
			dispatch(addJoinedStatus({ status: "joined" }));
		}
	}, [joinSuccess, dispatch, getTaskById, taskId]);

	useEffect(() => {
		if (commentSuccess) {
			setCommentList(commentsData.data);
		}
	}, [commentsData, commentSuccess]);

	return (
		<main className="taskDetail">
			{showContributionModal && (
				<CustomModal
					title="Add Contribution"
					submitText="Contribute"
					handleCancel={() => {
						setShowContributionModal(false);
						setContribution("");
					}}
					handleSubmit={handleSubmitReview}
					// handleSubmit={}
				>
					<textarea
						className="contributionTextArea"
						placeholder="Enter contribution details..."
						value={contribution}
						onChange={(e) => setContribution(e.target.value)}
					></textarea>
					<div className="contributionFileUpload">
						{file ? file.name : "Choose a file to upload..."}
						<div className="contributionFileUploadButton">
							<label htmlFor="file" className="uploadFileLabel">
								<input type="file" id="file" className="uploadFile" onChange={handleUpload} />
								<img src={attach} alt="Add attachment" />
							</label>
						</div>
					</div>
				</CustomModal>
			)}
			<div className="title">
				<span>
					<h3>Task : # {taskDetail?.data.title}</h3>
				</span>
				<span>
					<h3>Due : {formatDate(taskDetail?.data.deadLine)}</h3>
				</span>
			</div>
			<div className="details">
				<div className="detailSectionData">
					{form_fields.map((fields) => {
						return (
							<div className="fields">
								<label> {fields.name}</label>
								<div className={fields.id}>{taskDetail?.data[fields.id]}</div>
							</div>
						);
					})}
					<div className="typeSection">
						<div className="fields">
							<label> Type</label>
							<div className="type">{taskDetail?.data.maxParticipants > 1 ? "Group" : "Individual"}</div>
						</div>

						<div className="fields">
							<label> Max Participants</label>
							<div className="maxParticipants">{taskDetail?.data.maxParticipants}</div>
						</div>
					</div>
				</div>
				<div className="detailSectionBounty">
					<h3>Reward</h3> <img src={logo} alt="KoYns logo" />
					<div className="bountyPoints">{taskDetail?.data.totalBounty} KYNs</div>
					<div className="assignedBy">
						<h4>Assigned By : {taskDetail?.data.createdBy.name}</h4>
					</div>
				</div>
				<div className="particpantsListSection">
					<div className="particpantsListHeader">Particpants</div>
					<div className="particpantsList">
						{participantList.map((participant) => {
							return (
								<div className="partcipants" key={participant.id}>
									<img src={profile} alt="profile icon" />
									{participant.name}
								</div>
							);
						})}
					</div>
				</div>
			</div>
			{joined ? (
				<div className="bottomSection">
					<div className="commentSection">
						<div className="commentSectionHeader">
							{/* <div className="nameHeader">Name</div> */}
							{/* <div className="commentHeader"> */}
							<span>Comments</span>
							{/* <div className="commentFilter">
									<div
										className="commentFlag"
										onClick={() => handleCommentFilter("Normal")}
										style={commentType === "Normal" ? style : null}
									>
										Comment
									</div>
									<div
										className="review"
										onClick={() => handleCommentFilter("Review")}
										style={commentType === "Review" ? style : null}
									>
										Review
									</div>
								</div> */}
							{/* </div> */}
						</div>

						<div className="commentSectionWrapper">
							<div className="commentList">
								{commentList?.normalComments?.map(
									(comment) => (
										<CommentComponent
											comment={comment}
											handleReplyClick={handleReply}
											currentEmployeeId={loggedState.id}
										/>
									),

									/* return (
										<CommentComponent
											key={record.id}
											name={record.employee.name}
											comment={record.content}
											currEmployee="Test3"
											type="Normal"
											onClick={() => handleReply(record.id)}
											loggedState={loggedState}
											status={record.review_status}
										/>
									); */
								)}
							</div>
							<div className="addComment">
								<img src={commentIcon} alt="Comment Icon" />
								{mentionId && (
									<div className="mentionShowWrapper">
										<span className="mentionShow">{`Replying to ${mentionId}`}</span>
										<span className="removeMention" onClick={() => setMentionId(undefined)}>
											x
										</span>
									</div>
								)}
								<textarea
									ref={inputRef}
									className="commentBox"
									placeholder="//add comments"
									rows="1"
									onChange={handleTextArea}
									value={comment}
								/>
								<span className="commentButtons">
									<div className="sendButton">
										<img src={send} alt="Send Comment" onClick={handleSend} />
									</div>
								</span>
							</div>
						</div>
					</div>
					<div className="reviewSection">
						<div className="reviewSectionHeader">
							<span>Contributions</span>
							<Button
								type="button"
								className="addContributionButton"
								text="Add Contributions"
								isPrimary={true}
								onClick={() => setShowContributionModal(true)}
							/>
						</div>
						<div className="reviewWrapper">
							<div className="reviewList">
								{commentList?.reviewComments?.map((contribution) => {
									return <CommentComponent key={contribution.id} comment={contribution} />;
								})}
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="Join Button" onClick={handleJoin}>
					Join
				</div>
			)}
		</main>
	);
};
export default TaskDetail;
