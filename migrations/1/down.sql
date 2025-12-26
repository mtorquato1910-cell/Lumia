
DROP INDEX idx_tasks_status;
DROP INDEX idx_tasks_assigned_to;
DROP INDEX idx_tasks_org_id;
DROP INDEX idx_tasks_meeting_id;
DROP TABLE tasks;

DROP INDEX idx_meetings_status;
DROP INDEX idx_meetings_org_id;
DROP INDEX idx_meetings_user_id;
DROP TABLE meetings;

DROP INDEX idx_users_email;
DROP INDEX idx_users_org_id;
DROP INDEX idx_users_mocha_user_id;
DROP TABLE users;

DROP INDEX idx_organizations_owner_id;
DROP TABLE organizations;
