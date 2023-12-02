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

// enum LicenseOverride {
//   ACTIVE = 'active',
//   INACTIVE = 'inactive'
// }
const LicenseOverride = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};
const isLicenseActive = (context) => {
  // Check for an environment variable that overrides the license state
  const override = process.env.LICENSE_OVERRIDE;
  console.log({ override });
  if (typeof override !== "undefined") {
    if (override.toLowerCase() === LicenseOverride.ACTIVE) {
      return true;
    }
    if (override.toLowerCase() === LicenseOverride.INACTIVE) {
      return false;
    }
  }
  // Else return the actual value
  return context && context.license && context.license.active;
};

const App = () => {
  const context = useProductContext();
  const isActive = isLicenseActive(context);

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
