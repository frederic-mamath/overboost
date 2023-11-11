import ForgeUI, {
  render,
  Fragment,
  Text,
  IssuePanel,
  useProductContext,
  useState,
} from "@forge/ui";
import api, { route } from "@forge/api";

const fetchCommentsForIssue = async (issueIdOrKey) => {
  const res = await api
    .asUser()
    .requestJira(route`/rest/api/3/issue/${issueIdOrKey}/comment`);

  const data = await res.json();

  return data.comments;
};

const App = () => {
  const context = useProductContext();

  const [comments] = useState(
    async () => await fetchCommentsForIssue(context.platformContext.issueKey)
  );

  return (
    <Fragment>
      <Text>Number of comments on this issue: {comments.length}</Text>
    </Fragment>
  );
};

export const run = render(
  <IssuePanel>
    <App />
  </IssuePanel>
);
