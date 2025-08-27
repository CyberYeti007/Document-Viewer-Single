import { prisma } from "@/lib/db/postgres";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    return user;
  } catch {
    return null;
  };
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    return user;
  } catch {
    return null;
  };
};

export const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch {
    return null;
  }
}

export const readableUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id }});
    if (!user) return null
  const mgmt = await prisma.managementLevel.findUnique({ where: { id: user.managementLevelId || '' }})
  user.managementLevelId = mgmt?.name || null
  const role = await prisma.role.findUnique({ where: { id: user.roleId || ''}})
  user.roleId = role?.name || null
  return user
}

export const isAnyTeamAdmin = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id }, include: { teams: true } })
  if (!user) return false

  for (const team of user.teams) {
    if (team.isAdmin) return true
  }
  return false
}

export const isUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id }, include: { role: true } })
  if (!user) return false

  return (user?.role?.name === "User")
}

export const isAuditor = async (id: string) => {
    const user = await prisma.user.findUnique({ where: { id }, include: { role: true } })
  if (!user) return false

  return (user?.role?.name === "Auditor")
}

export const isModerator = async (id: string) => {
    const user = await prisma.user.findUnique({ where: { id }, include: { role: true } })
  if (!user) return false

  return (user?.role?.name === "Moderator")
}

export const isAdmin = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id }, include: { role: true } })
  if (!user) return false

  return (user?.role?.name === "Admin")
}

export const isDistributor = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id }, include: { role: true } })
  if (!user) return false

  return (user?.role?.name === "Distributor")
}

export const isApprover = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return false

  return (user?.isApprover)
}

// admin auditor moderator user
export const getAccessType = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { role: true }
  })
  
  // specific order of precedence
  if (user?.role?.name === "Moderator") return "moderator"
  else if (await isAnyTeamAdmin(user?.id || "")) return "admin"
  else if (user?.role?.name === "User") return "user"
  else if (user?.role?.name === "Auditor") return "auditor"

  return "user"
}

export const isFileOwner = async (userId: string, documentId?: string) => {
  if (!documentId) {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { filesOwned: true } })
    if (!user) return false

    return (user?.filesOwned.length !== 0)
  }
  const file = await prisma.file.findUnique({ where: { id: documentId } })
  if (!file) return false
  return (file.ownerId === userId)
}

export const getUserTeamMemberships = async (id: string) => {
  const user = await prisma.user.findUnique({ where: {id}, include: {teams: true} })
  if (!user) return []

  for (const t of user.teams) {
    const tempName = await prisma.team.findUnique({where: {id: t.teamId}, select: {name: true}})
    if (tempName?.name) t.teamId = tempName?.name
    else {
      throw new Error(`Team id (${t.teamId}) within user (${user.firstName}) doesn't exist on the Team table`)
    }
  }

  return user.teams
}
