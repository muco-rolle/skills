# Jazz Permissions & Security

## The Ownership Hierarchy

Every CoValue has an owner Group. Access is controlled through Group membership. Security is **cryptographic** and **group-based**.

**Critical Rule:** Just because List A contains a reference to Item B does NOT mean readers of List A can see Item B. Item B must be owned by a Group the reader has access to.

### Private (Default)

Creating CoValues without a specified owner creates a new Group with the current account as sole admin.

```ts
MyMap.create({ ... })  // Private by default
```

### Shared

```ts
MyMap.create({ ... }, { owner: teamGroup })  // Shared with group members
```

**You MUST NOT use an Account as a CoValue owner.** Always use Groups.

## Roles & Permissions Matrix

| Role | Capability | Best For |
| ------ | ------------ | ---------- |
| admin | Read, Write, Delete, Invite, Revoke, Change Roles | Team Owners |
| manager | Read, Write, Add/Remove readers/writers | Delegated management |
| writer | Read, Write | Collaborators |
| reader | Read Only | Observers |
| writeOnly | Write Only (Blind submissions) | Voting, Dropboxes |

Jazz uses fixed roles — no custom roles.

## Managing Groups

```ts
const group = co.group().create();
const bob = await co.account().load(bobsId);

if (bob.$isLoaded) {
  group.addMember(bob, "writer");
  group.addMember(bob, "reader"); // Change role
  group.removeMember(bob);
}
```

## Validating Permissions

```ts
const me = co.account().getMe();

if (me.canAdmin(coValue)) { /* full control */ }
else if (me.canManage(coValue)) { /* can share */ }
else if (me.canWrite(coValue)) { /* can edit */ }
else if (me.canRead(coValue)) { /* can view */ }

// Or get role directly
coValue.$jazz.owner.getRoleOf(me.$jazz.id); // "admin"
```

## Creating Shared Data

```ts
// WRONG: Defaults to private
const task = Task.create({ title: "Fix bug" });
project.tasks.push(task);

// RIGHT: Explicitly set owner
const task = Task.create(
  { title: "Fix bug" },
  { owner: project.$jazz.owner }
);
project.tasks.push(task);

// ALSO RIGHT: Inline creation handles group inheritance
const project = Project.create({
  tasks: [{ title: "Fix bug" }],  // Inherits permissions via schema config
});
```

## Invite Flow (React)

### Creating Invite Links

```ts
import { createInviteLink } from "jazz-tools/react";
const inviteLink = createInviteLink(organization, "writer");
```

### Accepting Invites

```tsx
import { useAcceptInvite } from "jazz-tools/react";

useAcceptInvite({
  invitedObjectSchema: Organization,
  onAccept: async (organizationID) => {
    const organization = await Organization.load(organizationID);
    if (!organization.$isLoaded) throw new Error("Could not load");
    me.root.organizations.$jazz.push(organization);
  },
});
```

**Security:** Invites do not expire and cannot be revoked. Never pass secrets as route parameters or query strings — only use fragment identifiers (hash in URL).

## Public Data

```ts
const group = Group.create();
group.makePublic("writer"); // Defaults to "reader"
```

## Cascading Permissions (Groups as Members)

Groups can be added as members of other groups, creating hierarchies.

```ts
const playlistGroup = Group.create();
const trackGroup = Group.create();
trackGroup.addMember(playlistGroup);
```

**Role inheritance rules:**
- Most permissive role wins for users with multiple entitlements
- Roles inherit (admin, manager, writer, reader) — except `writeOnly`
- Deep nesting causes performance issues

### Overriding Roles

```ts
const orgGroup = Group.create();
orgGroup.addMember(bob, "admin");

const billingGroup = Group.create();
billingGroup.addMember(orgGroup, "reader");
// All org members get reader access to billing, regardless of org role
```

### Team Hierarchy Example

```ts
const companyGroup = Group.create();
companyGroup.addMember(CEO, "admin");

const teamGroup = Group.create();
teamGroup.addMember(companyGroup);
teamGroup.addMember(teamLead, "admin");
teamGroup.addMember(developer, "writer");

const projectGroup = Group.create();
projectGroup.addMember(teamGroup);
projectGroup.addMember(client, "reader");
```

## Troubleshooting

### "User cannot see data"
1. **Verify Ownership**: Is the CoValue owned by the expected Group? Check `$jazz.owner`.
2. **Verify Membership**: Is the target user a member of that Group?
3. **Check References**: Does the user have a way to discover the ID?

### "Data is read-only"
1. **Check Role**: Use `coValue.$jazz.owner.getRoleOf(me.$jazz.id)` to check actual role. `reader` cannot write.

### Cascading Issues
1. **Group Membership**: If Group A is a member of Group B, check that the user is a member of Group A with a role that permits the desired action.
2. **writeOnly doesn't cascade.**
