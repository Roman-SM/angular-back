const express = require('express')
const router = express.Router()

const profiles = require('../util/profiles')

const { Profile } = require('../class/Profile')
const { User } = require('../class/User')

profiles.forEach((profile) => Profile.create(profile))

router.get('/profile-info', function (req, res) {
  const token = req.headers['authorization']

  if (!token) {
    return res.status(400).json({
      message:
        'Error: All data must be provided to create a user',
    })
  }
  try {
    const user = User.getByToken(token)

    if (!user) {
      return res.status(400).json({
        message:
          'Error: A user with this email does not exist',
      })
    }

    const profile = Profile.getByToken(token)
    if (!profile) {
      return res.status(400).json({
        message:
          'Error: A user with this email does not exist',
      })
    }
    const followers = Profile.getFollowersList(
      profile,
      profile,
    )
    const following = Profile.getFollowingList(
      profile,
      profile,
    )

    const followerId = profile.followers
    const followingId = profile.following

    profile.followers = followers
    profile.following = following
    setTimeout(() => {
      profile.followers = followerId
      profile.following = followingId
    }, 5)

    return res.status(200).json(profile)
  } catch (e) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

router.get('/profile-info/:id', function (req, res) {
  const profileId = req.params.id
  const token = req.headers['authorization']

  if (!profileId) {
    return res.status(400).json({
      message:
        'Error: All data must be provided to create a user',
    })
  }
  try {
    const me = Profile.getByToken(token)
    const profile = Profile.getById(Number(profileId))
    const followers = Profile.getFollowersList(profile, me)
    const following = Profile.getFollowingList(profile, me)

    const followerId = profile.followers
    const followingId = profile.following

    profile.followers = followers
    profile.following = following

    setTimeout(() => {
      profile.followers = followerId
      profile.following = followingId
    }, 5)

    return res.status(200).json(profile)
  } catch (e) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

router.get('/search-profile', function (req, res) {
  const { firstName, lastName, userName, stack } = req.query
  const token = req.headers['authorization']

  console.log(req.query)

  try {
    if (!token) {
      return res.status(400).json({
        message:
          'Error: All data must be provided to create a user',
      })
    }

    const me = Profile.getByToken(token)
    const profiles = Profile.getProfilesList(me, me.id)
    let filteredList

    if (!firstName && !lastName && !userName && !stack)
      filteredList = profiles

    const value = {
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      stack: stack,
    }
    if (firstName || lastName || userName || stack)
      filteredList = Profile.searchProfile(value, profiles)

    return res.status(200).json(filteredList)
  } catch (e) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

router.post('/upd-profile', function (req, res) {
  const { firstName, lastName, description, stack } =
    req.body
  const token = req.headers['authorization']

  if (!firstName && !lastName) {
    return res.status(400).json({
      message:
        'Error: All data must be provided to create a user',
    })
  }
  try {
    const profile = Profile.getByToken(token)

    if (!profile) {
      return res.status(400).json({
        message:
          'Error: A user with this email does not exist',
      })
    }

    Profile.updProfileInfo(
      profile,
      firstName,
      lastName,
      description,
      stack,
    )

    const followers = Profile.getFollowersList(profile)
    const following = Profile.getFollowingList(profile)

    const followerId = profile.followers
    const followingId = profile.following

    profile.followers = followers
    profile.following = following

    setTimeout(() => {
      profile.followers = followerId
      profile.following = followingId
    }, 5)

    return res.status(200).json(profile)
  } catch (e) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

router.get('/search-followers/:id', function (req, res) {
  const { firstName, lastName, userName, stack } = req.query
  const profileId = req.params.id
  const token = req.headers['authorization']

  try {
    if (!profileId && !token) {
      return res.status(400).json({
        message:
          'Error: All data must be provided to create a user',
      })
    }

    const me = Profile.getByToken(token)
    const profile = Profile.getById(profileId)
    const followers = Profile.getFollowersList(profile, me)
    let filteredList

    if (!firstName && !lastName && !userName && !stack)
      filteredList = followers

    const value = {
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      stack: stack,
    }
    if (firstName || lastName || userName || stack)
      filteredList = Profile.searchProfile(value, followers)

    return res.status(200).json(filteredList)
  } catch (e) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

router.get('/search-following/:id', function (req, res) {
  const { firstName, lastName, userName, stack } = req.query
  const profileId = req.params.id
  const token = req.headers['authorization']

  try {
    if (!profileId && !token) {
      return res.status(400).json({
        message:
          'Error: All data must be provided to create a user',
      })
    }

    const me = Profile.getByToken(token)
    const profile = Profile.getById(profileId)
    const following = Profile.getFollowingList(profile, me)
    let filteredList

    if (!firstName && !lastName && !userName && !stack)
      filteredList = following

    const value = {
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      stack: stack,
    }
    if (firstName || lastName || userName || stack)
      filteredList = Profile.searchProfile(value, following)

    return res.status(200).json(filteredList)
  } catch (e) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

router.post('/profile-delete', function (req, res) {
  const token = req.headers['authorization']

  if (!token) {
    return res.status(400).json({
      message:
        'Error: All data must be provided to create a user',
    })
  }
  try {
    const user = User.getByToken(token)
    if (!user) {
      return res.status(400).json({
        message:
          'Error: A user with this email does not exist',
      })
    }
    const profile = Profile.getByToken(token)
    if (!profile) {
      return res.status(400).json({
        message:
          'Error: A user with this email does not exist',
      })
    }
    User.deleteUser(token)
    Profile.deleteProfile(token)

    return res.status(200).json({})
  } catch (e) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

router.post('/add-follower', function (req, res) {
  const { id } = req.body
  const token = req.headers['authorization']

  if (!token && !id) {
    return res.status(400).json({
      message:
        'Error: All data must be provided to create a user',
    })
  }
  try {
    const profile = Profile.getByToken(token)

    if (!profile) {
      return res.status(400).json({
        message:
          'Error: A user with this email does not exist',
      })
    }

    const follower = Profile.getById(id)

    Profile.addFollowing(profile, id)
    Profile.addFollower(follower, profile.id)

    return res.status(200).json({})
  } catch (e) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

router.post('/del-follower', function (req, res) {
  const { id } = req.body
  const token = req.headers['authorization']

  if (!token && !id) {
    return res.status(400).json({
      message:
        'Error: All data must be provided to create a user',
    })
  }
  try {
    const profile = Profile.getByToken(token)

    if (!profile) {
      return res.status(400).json({
        message:
          'Error: A user with this email does not exist',
      })
    }
    Profile.delFollower(profile, id)
    Profile.delFollowing(profile, id)

    return res.status(200).json({})
  } catch (e) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

router.post('/post-create', function (req, res) {
  const { post } = req.body
  const token = req.headers['authorization']

  if (!token && !post) {
    return res.status(400).json({
      message:
        'Error: All data must be provided to create a user',
    })
  }
  try {
    const profile = Profile.getByToken(token)

    if (!profile) {
      return res.status(400).json({
        message:
          'Error: A user with this email does not exist',
      })
    }

    Profile.postCreate(profile, post.postInfo)

    return res.status(200).json({})
  } catch (e) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

router.post('/comment-create', function (req, res) {
  const { comment, profileId, postId } = req.body
  const token = req.headers['authorization']

  if (!token && !comment && !postId) {
    return res.status(400).json({
      message:
        'Error: All data must be provided to create a user',
    })
  }
  try {
    const profile = Profile.getByToken(token)

    if (!profile) {
      return res.status(400).json({
        message:
          'Error: A user with this email does not exist',
      })
    }

    const profiles = Profile.getById(profileId)

    const profileInfo = {
      id: profile.id,
      avatarUrl: profile.avatarUrl,
      firstName: profile.firstName,
      lastName: profile.lastName,
    }

    Profile.commentCreate(
      postId,
      profiles,
      profileInfo,
      comment.commentInfo,
    )

    return res.status(200).json({})
  } catch (e) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// Експортуємо глобальний роутер
module.exports = router
