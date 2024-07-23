/* eslint-disable react/jsx-key */
import "./styles.scss";
import logo from "../../assets/KoYns-Logo.png";
import commentIcon from "../../assets/commentIcon.svg";
import attach from "../../assets/attach.svg";
import profile from "../../assets/profile.png";
import send from "../../assets/send.svg";
import CommentComponent from "../../components/CommentComponent/CommentComponent";
import Button from "../../components/Button/Button";
import { useEffect, useRef, useState } from "react";
import {
	useCreateCommentMutation,
	useGetCommentsByTaskIdQuery,
	useGetTaskByIdQuery,
	useJoinTaskMutation,
} from "../../api/taskApi";
import { formatDate } from "../../utils/date.utils";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addJoinedStatus } from "../../store/employeeReducer";

const TaskDetail = () => {
	//-----------constants--------
	const { taskId } = useParams();
	const [commentList, setCommentList] = useState([]);
	const [participantList, setParticipantList] = useState([]);
	const [file, uploadFile] = useState();
	const [replyText, setReplyText] = useState("");
	const [joined, setJoined] = useState(false);
	const inputRef = useRef();
	const style = {
		backgroundColor: "white",
		color: "#2c95ce",
		boxShadow: "0.5px 0.5px 0.5px  0.5px #8c96a0",
	};

	const [comment, setComment] = useState("");
	const [mentionId, setMentionId] = useState();

	//------------queries--------
	const { data: taskDetail, isSuccess: taskSuccess } = useGetTaskByIdQuery(taskId);
	const { data: commentsData, isSuccess: commentSuccess } = useGetCommentsByTaskIdQuery(taskId);
	const [join, { isSuccess: joinSuccess }] = useJoinTaskMutation();
	const [createComment] = useCreateCommentMutation();

	// ----------stateVar----------
	const loggedState = useSelector((state) => state.employee);
	const dispatch = useDispatch();
	//----
	const token = localStorage.getItem("token");
	const arrayToken = token.split(".");
	const tokenPayload = JSON.parse(atob(arrayToken[1]));

	const form_fields = [
		{
			id: "description",
			name: "Description",
			// value: "create a bounty tracker system with rewwards and bounty points for tasks completed",
			value: taskDetail?.description,
		},

		{
			id: "skills",
			name: "Skills",
			// value: "Node, react, java, c",
			value: taskDetail?.skillList,
		},
	];
	const handleSend = async () => {
		const formData = new FormData();
		const commentData = {
			id: taskId,
			content: comment,
			commentType: "Normal",
			mentionCommentId: mentionId,
		};
		createComment(commentData);
		inputRef.current.value = "";
		setReplyText("");
	};

	const handleTextArea = (e) => {
		setComment(e.target.value);
	};

	const handleUpload = (e) => {
		uploadFile(e.target.files[0]);
	};

	const handleReply = (id) => {
		inputRef.current.focus();
		const mentionComment = commentList.normalComments.filter((record) => record.id === id);
		// console.log(mentionComment);
		const replyText = `replied : (${mentionComment[0].employee.name}) [${mentionComment[0].content}]: \n`;
		inputRef.current.value = replyText;
		setReplyText(replyText);
		setMentionId(id);
	};

	const handleJoin = () => {
		join(taskId);
	};

	//--------useEffects--------
	useEffect(() => {
		if (taskSuccess) {
			taskDetail.data.participants.forEach((participant) => {
				if (participant.name === tokenPayload.name) {
					// dispatch(addJoinedStatus({ id: taskId, status: "joined" }));
					setJoined(true);
					console.log("joined");
				}
			});
		}
	}, [taskSuccess, taskDetail, joined]);
	useEffect(() => {
		if (commentSuccess) {
			setCommentList(commentsData.data);
		}
	}, [commentsData, commentSuccess]);
	useEffect(() => {
		if (joinSuccess) {
			dispatch(addJoinedStatus({ id: taskId, status: "joined" }));
			setJoined(true);
		}
	}, [joinSuccess]);
	return (
		<main className="taskDetail">
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
						{taskDetail?.data.participants.map((participant) => {
							return (
								<div className="partcipants">
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
							<span>Comments</span>
						</div>

						<div className="commentWrapper">
							<div className="commentList">
								{commentList?.normalComments?.map((record) => {
									return (
										<CommentComponent
											key={record.id}
											name={record.employee.name}
											comment={record.content}
											type="Normal"
											onClick={() => handleReply(record.id)}
											loggedState={loggedState}
											status={record.review_status}
											reply={record.mentionCommentId}
										/>
									);
								})}
							</div>
							<div className="addComment">
								<img src={commentIcon} alt="Comment Icon" />
								<textarea
									ref={inputRef}
									className="commentBox"
									placeholder="//add comments"
									rows="1"
									onChange={handleTextArea}
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
							<span>Review</span>
							<Button text="Add Review" className="reviewButton" />
						</div>
						<div className="reviewWrapper">
							<div className="reviewList">
								{commentList?.reviewComments?.map((record) => {
									return (
										<CommentComponent
											key={record.id}
											name={record.employee.name}
											comment={record.content}
											type="Review"
											onClick={() => handleReply(record.id)}
											loggedState={loggedState}
											status={record.reviewStatus}
										/>
									);
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
