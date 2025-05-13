# Milestone Data

## Date Generated: 2025-05-13
| Developer | Points Closed | Percent Contribution | Indivudal Grade | Milestone Grade | Lecture Topic Tasks |
| --------- | ------------- | -------------------- | --------------- | --------------- | ------------------- |
| Total | 0 | /100% | /100% | /100% | 0 |


## Sprint Task Completion

| Developer | Sprint 1<br>2025/05/12, 09:06 PM<br>2025/05/12, 09:06 PM | Sprint 2<br>2025/05/12, 09:06 PM<br>2025/05/12, 09:06 PM |
|---|---|---|

## Weekly Discussion Participation

| Developer | Week #1 | Week #2 | Week #3 | Week #4 | Week #5 | Week #6 | Penalty |
|---|---|---|---|---|---|---|---|

## Point Percent by Label

# Metrics Generation Logs

| Message |
| ------- |
| INFO: Found Project(name='petfinder', number=8, url='https://github.com/orgs/uprm-inso4117-2024-2025-s2/projects/8', public=False) |
| WARNING: Project visibility is set to private. This can lead to issues not being found if the Personal Access Token doesn't have permissions for viewing private projects. |
| ERROR: Query failed to run, status code 403 |
| { |
|   "documentation_url": "https://docs.github.com/free-pro-team@latest/rest/overview/rate-limits-for-the-rest-api#about-secondary-rate-limits", |
|   "message": "You have exceeded a secondary rate limit. Please wait a few minutes before you try again. If you reach out to GitHub Support for help, please include the request ID 9441:2B1E8B:C73834:18FE939:68229B1C." |
| } |
| Traceback (most recent call last): |
|   File "/home/runner/work/semester-project-petfinder/semester-project-petfinder/inso-gh-query-metrics/src/generateMilestoneMetricsForActions.py", line 80, in generateMetricsFromV2Config |
|     team_metrics = getTeamMetricsForMilestone( |
|                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^ |
|   File "/opt/hostedtoolcache/Python/3.11.12/x64/lib/python3.11/concurrent/futures/thread.py", line 58, in run |
|     result = self.fn(*self.args, **self.kwargs) |
|              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ |
|   File "/home/runner/work/semester-project-petfinder/semester-project-petfinder/inso-gh-query-metrics/src/generateTeamMetrics.py", line 301, in getLectureTopicTaskMetricsFromIssues |
|     for issue in issues: |
|   File "/home/runner/work/semester-project-petfinder/semester-project-petfinder/inso-gh-query-metrics/src/generateTeamMetrics.py", line 376, in queueIteratorNext |
|     raise value |
|   File "/home/runner/work/semester-project-petfinder/semester-project-petfinder/inso-gh-query-metrics/src/generateTeamMetrics.py", line 477, in getTeamMetricsForMilestone |
|     for issue in getIteratorFromQueue(issueMetricsQueue): |
|   File "/home/runner/work/semester-project-petfinder/semester-project-petfinder/inso-gh-query-metrics/src/generateTeamMetrics.py", line 376, in queueIteratorNext |
|     raise value |
|   File "/home/runner/work/semester-project-petfinder/semester-project-petfinder/inso-gh-query-metrics/src/generateTeamMetrics.py", line 358, in iteratorSplitter |
|     for item in iterator: |
|   File "/home/runner/work/semester-project-petfinder/semester-project-petfinder/inso-gh-query-metrics/src/generateTeamMetrics.py", line 234, in fetchProcessedIssues |
|     for issue_dict in fetchIssuesFromGithub(org=org, team=team, logger=logger): |
|   File "/home/runner/work/semester-project-petfinder/semester-project-petfinder/inso-gh-query-metrics/src/generateTeamMetrics.py", line 186, in fetchIssuesFromGithub |
|     response: dict = runGraphqlQuery(query=get_team_issues, variables=params) |
|                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ |
|   File "/home/runner/work/semester-project-petfinder/semester-project-petfinder/inso-gh-query-metrics/src/utils/queryRunner.py", line 63, in runGraphqlQuery |
|     raise ConnectionError( |
| ConnectionError: Query failed to run, status code 403 |
| { |
|   "documentation_url": "https://docs.github.com/free-pro-team@latest/rest/overview/rate-limits-for-the-rest-api#about-secondary-rate-limits", |
|   "message": "You have exceeded a secondary rate limit. Please wait a few minutes before you try again. If you reach out to GitHub Support for help, please include the request ID 9441:2B1E8B:C73834:18FE939:68229B1C." |
| } |
