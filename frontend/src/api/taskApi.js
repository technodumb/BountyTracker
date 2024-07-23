import { apiWithTaskTags } from "./baseApi";

const taskApi = apiWithTaskTags.injectEndpoints({
	endpoints: (builder) => ({
		getTaskList: builder.query({
			query: () => "/tasks",
		}),
		getTaskById: builder.query({
			query: (id) => `/tasks/${id}`,
		}),
		createTask: builder.mutation({
			query: (data) => ({ url: "/tasks", method: "POST", body: data }),
		}),
		getCommentsByTaskId: builder.query({
			query: (id) => `/tasks/${id}/comments`,
			providesTags: ["COMMENTS", "REVIEW"],
		}),
		createComment: builder.mutation({
			query: (data) => {
				console.log("create Comment");
				return {
					url: `/tasks/${parseInt(data.taskId)}/comments`,
					method: "POST",
					body: data.formData,
				};
			},
			invalidatesTags: ["COMMENTS"],
		}),
		reviewCommentById: builder.mutation({
			query: ({ ...data }) => ({ url: `tasks/comments/${parseInt(data.id)}`, method: "PATCH", body: data }),
			invalidatesTags: ["REVIEW"],
		}),

		getCommentById: builder.query({
			query: (id) => `/tasks/comments/${id}`,
		}),

		joinTask: builder.mutation({
			query: (id) => ({
				url: `/employees/tasks/${id}`,
				method: "POST",
			}),
			invalidatesTags: ["COMMENTS", "REVIEW"],
		}),

		completeTask: builder.mutation({
			query: (id) => ({
				url: `tasks/complete/${id}`,
				method: "PATCH",
			}),
		}),
	}),
});

export const {
	useGetTaskListQuery,
	useGetTaskByIdQuery,
	useLazyGetTaskByIdQuery,
	useCreateTaskMutation,
	useGetCommentsByTaskIdQuery,
	useCreateCommentMutation,
	useReviewCommentByIdMutation,
	useGetCommentByIdQuery,
	useJoinTaskMutation,
	useCompleteTaskMutation,
} = taskApi;
