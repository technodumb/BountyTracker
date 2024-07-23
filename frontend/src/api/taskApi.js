import apiWithTag from "./baseApi";

const taskApi = apiWithTag.injectEndpoints({
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
			providesTags: ["COMMENTS"],
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
		}),
		getCommentById: builder.query({
			query: (id) => `/tasks/comments/${id}`,
		}),

		joinTask: builder.mutation({
			query: (id) => ({
				url: `/employees/tasks/${id}`,
				method: "POST",
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
} = taskApi;
