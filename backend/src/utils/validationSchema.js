export const registerSchema = {
  username:{
    notEmpty:{
      errorMessage:'username should not be empty'
    },
    isString:{
      errorMessage:'username should be a string'
    },
    isLength:{
      options:{
        min:3,
        //max:32
      },
      errorMessage:'Length of username must be greater than 3!'
    },
    trim:true,
    escape:true
  },
  email:{
    trim:true,
    escape:true,
    isLength:{
      options:{
        min:12,
        //max:32
      },
      errorMessage:'Length of email must be greater than 12!'
    }
  },
  password:{
    trim:true,
    escape:true,
    isLength:{
      options:{
        min:8,
        //max:32
      },
      errorMessage:'Password must be of 8 characters or more!',
    }
  },
  rePassword:{
    trim:true,
    escape:true,
    isLength:{
      options:{
        min:8,
        //max:32
      },
      errorMessage:'Password must be of 8 characters or more!',
    } 
  },
}

export const loginSchema = {
  email:{
    trim:true,
    escape:true,
    isLength:{
      options:{
        min:3,
        //max:32
      },
      errorMessage:'Email must be at least 3 characters long'
    }
  },
  password:{
    trim:true,
    escape:true,
    isLength:{
      options:{
        min:8,
        //max:32
      },
      errorMessage:'Password must be at least 8 characters long'
    }
  }
}