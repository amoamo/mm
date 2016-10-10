'use strict';

module.exports = {

  'GET /qa/all': function(req, res) {

    //req -> request
    // 可以获取参数
    //req.query -> get
    //req.requestBody -> post
    //res-> response
    // Meile1 感觉还是有点麻烦啊 还得每次改文件里的开关 不过能post不错
    // 恩，我看看能不能动态改啊

  	//刚才有人问问题。。。你在干嘛
     // 哎，用不了，等我看看了只有=。-....
     //好啊。你看看嘛134 失败了。。。，你继续

  	res.json(
		[{
		    "id": 11,
		    "categoryName": "category1",
		    "question": "question_string1",
		    "answer": "answer_string1"
		},{
		    "id": 33,
		    "categoryName": "category2",
		    "question": "question_string1",
		    "answer": "answer_string1"
		},{
		    "id": 22,
		    "categoryName": "category2",
		    "question": "question_string2",
		    "answer": "answer_string2"
		}]

  	)
  },
  'GET /category': function(req, res) {
  	res.json(
		[{
		    "name": "category1",
		    "id": 111
		},{
		    "name": "category2",
		    "id": 222
		}]
  	)
  }
  // 好了
};
