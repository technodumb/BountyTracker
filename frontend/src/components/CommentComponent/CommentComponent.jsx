import "./styles.scss";

const CommentComponent = ({ comment, handleReplyClick, currentEmployeeEmail }) => {
	const isOwnComment = comment?.employee?.email === currentEmployeeEmail;
	return (
		comment && (
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
		)
	);
};

export default CommentComponent;
