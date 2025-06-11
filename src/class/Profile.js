const getDate = require('../util/getDate')

class Profile {
  static #count = 1
  static #profilesList = []
  static #date = new Date().getTime()

  constructor(
    token,
    subscriptionsAmount,
    isActive,
    description,
    username,
    avatarUrl,
    firstName,
    lastName,
    stack,
    city,
    followers,
    following,
  ) {
    this.id = Profile.#count++
    this.token = token
    this.subscriptionsAmount = subscriptionsAmount
    this.isActive = isActive
    this.description = description
    this.username = username
    this.avatarUrl = avatarUrl
    this.firstName = firstName
    this.lastName = lastName
    this.stack = stack
    this.city = city
    this.followers = followers
    this.following = following
  }

  static create(profile) {
    this.#profilesList.push(profile)
    return profile
  }
  static getById(id) {
    return (
      this.#profilesList.find(
        (user) => user.id === Number(id),
      ) || null
    )
  }
  static deleteProfile(token) {
    const newArr = this.#profilesList.filter(
      (item) => item.token !== token,
    )
    return (this.#profilesList = newArr)
  }
  static getProfilesList(currentProfile, id) {
    const profileList = this.#profilesList
      .filter((profile) => profile.id !== id)
      .map((profile) => {
        const isSubscribed =
          currentProfile.following.includes(profile.id)
        return {
          id: profile.id,
          userName: profile.userName,
          avatarUrl: profile.avatarUrl,
          firstName: profile.firstName,
          lastName: profile.lastName,
          stack: profile.stack,
          isSubscribed,
          description: profile.description,
          followers: profile.followers,
          following: profile.following,
          postList: profile.postList,
        }
      })
    return profileList
  }
  static updProfileInfo(
    profile,
    firstName,
    lastName,
    description,
    stack,
  ) {
    if (firstName !== '') {
      if (profile.firstName !== firstName)
        profile.firstName = firstName
    }
    if (lastName !== '') {
      if (profile.lastName !== lastName)
        profile.lastName = lastName
    }
    if (description !== '') {
      if (profile.description !== description)
        profile.description = description
    }
    if (stack !== '') {
      console.log(stack)
      const stackArr = profile.stack.join(',')
      if (stackArr !== stack)
        profile.stack = stack.split(',')
    }
  }
  static searchProfile(value, followers) {
    const filterList = []
    console.log(value)
    if (value.firstName !== '') {
      const filteredProfiles = followers.filter((user) =>
        user.firstName
          .toLowerCase()
          .includes(value.firstName.toLowerCase()),
      )
      filteredProfiles.forEach((profile) => {
        const profileInfo = {
          id: profile.id,
          userName: profile.userName,
          avatarUrl: profile.avatarUrl,
          firstName: profile.firstName,
          lastName: profile.lastName,
          stack: profile.stack,
          isSubscribed: profile.isSubscribed,
          description: profile.description,
          followers: profile.followers,
          following: profile.following,
          postList: profile.postList,
        }
        filterList.push(profileInfo)
      })
      return filterList
    }
    if (value.lastName !== '') {
      const filteredProfiles = followers.filter((user) =>
        user.lastName
          .toLowerCase()
          .includes(value.lastName.toLowerCase()),
      )
      filteredProfiles.forEach((profile) => {
        const profileInfo = {
          id: profile.id,
          userName: profile.userName,
          avatarUrl: profile.avatarUrl,
          firstName: profile.firstName,
          lastName: profile.lastName,
          stack: profile.stack,
          isSubscribed: profile.isSubscribed,
          description: profile.description,
          followers: profile.followers,
          following: profile.following,
          postList: profile.postList,
        }
        filterList.push(profileInfo)
      })
      return filterList
    }
    if (value.userName !== '') {
      const filteredProfiles = followers.filter((user) =>
        user.userName
          .toLowerCase()
          .includes(value.userName.toLowerCase()),
      )
      filteredProfiles.forEach((profile) => {
        const profileInfo = {
          id: profile.id,
          userName: profile.userName,
          avatarUrl: profile.avatarUrl,
          firstName: profile.firstName,
          lastName: profile.lastName,
          stack: profile.stack,
          isSubscribed: profile.isSubscribed,
          description: profile.description,
          followers: profile.followers,
          following: profile.following,
          postList: profile.postList,
        }
        filterList.push(profileInfo)
      })
      return filterList
    }
    if (value.stack !== '') {
      const filteredProfiles = followers.filter((user) =>
        user.stack.some((s) =>
          s
            .toLowerCase()
            .includes(value.stack.toLowerCase()),
        ),
      )
      console.log(filteredProfiles)
      filteredProfiles.forEach((profile) => {
        const profileInfo = {
          id: profile.id,
          userName: profile.userName,
          avatarUrl: profile.avatarUrl,
          firstName: profile.firstName,
          lastName: profile.lastName,
          stack: profile.stack,
          isSubscribed: profile.isSubscribed,
          description: profile.description,
          followers: profile.followers,
          following: profile.following,
          postList: profile.postList,
        }
        filterList.push(profileInfo)
      })
      return filterList
    }
    return filterList
  }
  static getByToken(token) {
    return (
      this.#profilesList.find(
        (user) => user.token === token,
      ) || null
    )
  }
  static addFollower = (profile, id) => {
    const profileId = profile.followers.find(
      (val) => val === id,
    )
    if (profileId) return
    return profile.followers.push(id)
  }
  static addFollowing = (profile, id) => {
    const profileId = profile.following.find(
      (val) => val === id,
    )
    if (profileId) return
    return profile.following.push(id)
  }
  static delFollower = (profile, id) => {
    const profileId = profile.followers.filter(
      (val) => val !== id,
    )
    return (profile.followers = profileId)
  }
  static delFollowing = (profile, id) => {
    const profileId = profile.following.filter(
      (val) => val !== id,
    )
    return (profile.following = profileId)
  }
  static getFollowersList(profile, me) {
    const followersList = []
    for (let i of profile.followers) {
      const profile = this.#profilesList.find(
        (user) => user.id === i,
      )
      const isSubscribed = me.following.includes(profile.id)
      const profileInfo = {
        id: profile.id,
        userName: profile.userName,
        avatarUrl: profile.avatarUrl,
        firstName: profile.firstName,
        lastName: profile.lastName,
        stack: profile.stack,
        isSubscribed,
        description: profile.description,
        followers: profile.followers,
        following: profile.following,
        postList: profile.postList,
      }
      followersList.push(profileInfo)
    }
    return followersList
  }
  static getFollowingList(profile, me) {
    const followingList = []
    for (let i of profile.following) {
      const profile = this.#profilesList.find(
        (user) => user.id === i,
      )
      const isSubscribed = me.following.includes(profile.id)
      const profileInfo = {
        id: profile.id,
        userName: profile.userName,
        avatarUrl: profile.avatarUrl,
        firstName: profile.firstName,
        lastName: profile.lastName,
        stack: profile.stack,
        isSubscribed: isSubscribed,
        description: profile.description,
        followers: profile.followers,
        following: profile.following,
        postList: profile.postList,
      }
      followingList.push(profileInfo)
    }
    return followingList
  }
  static postCreate(profile, post) {
    const id = profile.postList.length
    const postCreate = {
      postId: id + 1,
      description: post,
      date: getDate(Profile.#date),
      comment: [],
    }
    return profile.postList.push(postCreate)
  }
  static commentCreate(
    postId,
    profile,
    profileInfo,
    commentInfo,
  ) {
    const id = profile.postList[postId - 1].comment.length
    const commentCreate = {
      commentId: id + 1,
      profileId: profileInfo.id,
      avatarUrl: profileInfo.avatarUrl,
      description: commentInfo,
      date: getDate(Profile.#date),
      firstName: profileInfo.firstName,
      lastName: profileInfo.lastName,
    }
    return profile.postList[postId - 1].comment.push(
      commentCreate,
    )
  }
}

module.exports = {
  Profile,
}
