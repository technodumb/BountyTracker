import "./styles.scss";

const CommentComponent1 = ({ comment, handleReplyClick, currentEmployeeId }) => {
	const isOwnComment = comment.employee.id === currentEmployeeId;
	// console.log(comment);
	return (
		<div className="commentRecord" style={flagType ? (flagUser ? { justifyContent: "right" } : null) : null}>
			{!flagUser ? <div className="name">{name}</div> : null}
			<div className="comment" style={flagType ? (flagUser ? styleCommentUser : styleCommentNotUser) : null}>
				{comment}
				{!flagType ? (
					<div className="reviewStatus" onClick={onClick}>
						{status}
					</div>
				) : null}
		<>
			<div className={`commentWrapper ${isOwnComment ? "ownComment" : ""}`}>
				<div className="commentBody">
					{!isOwnComment && <span className="commentUsername">{comment.employee.name}</span>}
					{comment.mentionComment && (
						<span className="mentionComment">
							<span className="mentionedEmployee">{comment.mentionComment.employee.name}</span>
							<span className="mentionedCommentContent">{comment.mentionComment.content}</span>
						</span>
					)}
					<span className="commentContent">{comment.content}</span>
				</div>
				<span className="replyLink" onClick={() => handleReplyClick(comment.id)}>
					Reply
				</span>
			</div>
		</>
	);
};

export default CommentComponent1;
