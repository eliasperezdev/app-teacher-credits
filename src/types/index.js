/**
 * @typedef {Object} Teacher
 * @property {string} id
 * @property {string} email
 * @property {string} name
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} token
 * @property {Teacher} teacher
 */

/**
 * @typedef {Object} SubjectCount
 * @property {number} commissions
 */

/**
 * @typedef {Object} Subject
 * @property {string} id
 * @property {string} name
 * @property {string} code
 * @property {string} createdAt
 * @property {SubjectCount} [_count]
 * @property {CommissionLite[]} [commissions]
 */

/**
 * @typedef {Object} CommissionLite
 * @property {string} id
 * @property {string} name
 * @property {number} year
 * @property {number} period
 */

/**
 * @typedef {Object} CommissionCount
 * @property {number} commissionStudents
 * @property {number} groups
 * @property {number} [classSessions]
 */

/**
 * @typedef {Object} Commission
 * @property {string} id
 * @property {string} name
 * @property {number} year
 * @property {number} period
 * @property {number} minGroupSize
 * @property {number} maxGroupSize
 * @property {number} creditValue
 * @property {boolean} autoCompleteGroups
 * @property {string} createdAt
 * @property {SubjectLite} [subject]
 * @property {CommissionCount} [_count]
 */

/**
 * @typedef {Object} SubjectLite
 * @property {string} id
 * @property {string} name
 * @property {string} code
 */

/**
 * @typedef {Object} GroupLite
 * @property {string} id
 * @property {string} name
 * @property {boolean} isActive
 * @property {number} totalCredits
 */

/**
 * @typedef {Object} Student
 * @property {string} id
 * @property {string} fileNumber
 * @property {string} lastName
 * @property {string} firstName
 * @property {string} enrolledAt
 * @property {GroupLite | null} group
 */

/**
 * @typedef {Object} GroupMember
 * @property {string} id
 * @property {string} fileNumber
 * @property {string} lastName
 * @property {string} firstName
 * @property {string} joinedAt
 * @property {string} [leftAt]
 */

/**
 * @typedef {Object} Group
 * @property {string} id
 * @property {string} name
 * @property {boolean} isActive
 * @property {number} totalCredits
 * @property {string} createdAt
 * @property {GroupMember[]} members
 * @property {CreditEvent[]} [creditEvents]
 */

/**
 * @typedef {Object} SessionCount
 * @property {number} raffles
 * @property {number} creditEvents
 */

/**
 * @typedef {Object} Session
 * @property {string} id
 * @property {string} sessionDate
 * @property {string | null} notes
 * @property {boolean} isClosed
 * @property {string} createdAt
 * @property {SessionCount} [_count]
 * @property {Raffle[]} [raffles]
 * @property {CreditEvent[]} [creditEvents]
 */

/**
 * @typedef {Object} RaffleResultGroup
 * @property {string} id
 * @property {string} name
 * @property {number} totalCredits
 * @property {number} memberCount
 */

/**
 * @typedef {'PENDING' | 'PARTICIPATED' | 'ABSENT' | 'SKIPPED'} RaffleStatus
 */

/**
 * @typedef {Object} RaffleResult
 * @property {string} id
 * @property {RaffleStatus} status
 * @property {string | null} resolvedAt
 * @property {RaffleResultGroup} group
 */

/**
 * @typedef {Object} Raffle
 * @property {string} id
 * @property {number} quantity
 * @property {number} roundNumber
 * @property {string} createdAt
 * @property {RaffleResult[]} results
 */

/**
 * @typedef {Object} CreditEventSession
 * @property {string} id
 * @property {string} sessionDate
 */

/**
 * @typedef {Object} CreditEventRaffle
 * @property {string} id
 * @property {RaffleStatus} status
 */

/**
 * @typedef {Object} CreditEvent
 * @property {string} id
 * @property {number} amount
 * @property {string} reason
 * @property {string} createdAt
 * @property {boolean} isReversal
 * @property {string | null} reversedById
 * @property {CreditEventSession} session
 * @property {CreditEventRaffle | null} raffleResult
 */

/**
 * @typedef {Object} CreditSummaryMember
 * @property {string} id
 * @property {string} lastName
 * @property {string} firstName
 * @property {number} totalCredits
 * @property {number} pointsValue
 */

/**
 * @typedef {Object} CreditSummaryGroup
 * @property {string} id
 * @property {string} name
 * @property {boolean} isActive
 * @property {number} totalCredits
 * @property {number} pointsValue
 * @property {number} memberCount
 * @property {CreditSummaryMember[]} members
 */

/**
 * @typedef {Object} CreditSummary
 * @property {number} creditValue
 * @property {CreditSummaryGroup[]} groups
 */

export {};
