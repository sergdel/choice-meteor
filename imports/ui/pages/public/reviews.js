import './reviews.html'
const reviews_arr = [
  {name:"Angelean and Viliamu Frost", photo:"/img/review_1.jpg", content:"My husband and I enjoyed doing the homestay program with Choice. The communication was excellend, payment was received on time, and we would love to continue being host parents with Choice Homestay. Thank you"},
  {name:"Michelle and Dean Cook ", photo:"/img/review_2.jpg", content:"This was mine and my husbands first time hosting students and we throughly enjoyed having Lilly and Lewis stay with us. They were very polite and very willing to sit and speak with us. Choice homestay were very professional from the first meeting we had with them and were prompt at returning emails and answering any questions that we had in a timely manner. My husband and I are looking forward to the next adventure with Choice Homestay visitors."},
  {name:"Daphne Ritai", photo:"/img/review_3.jpg", content:"My first experience hosting students with Choice was very positive, it was like being part of a huge family. The interaction with staff was positive, I felt very supported by Choice. The students were lovely, we got on so well with them all and they enjoyed the interaction with ourselves and our extended family.  I look forward to more experiences with students from around the world, learning about their cultures and they learn about our way of life. "},
  {name:"Mariushca and Gerald Anderson", photo:"/img/review_4.jpg", content:'We really enjoyed hosting our two 11 and 12 year old Chinese students! They were delightful and were always open to new experiences and loved our cooking. We took the boys exploring as often as we could and took copious amounts of photos which we presented to them on a memory stick to take home to their parents, giving everybody the chance to share in the adventure. We have established friendships with the boys parents and we will endeavour to keep track of how "our" two boys are doing in the future. I believe we all grew from this experience as we expanded our knowledge of a different culture and we were also reminded again that no matter where in life we come from, we are all lovely human beings full of love and laughter and we each have something special to share with the world around us. I will encourage everybody to host a student as it enables you to increase your knowledge, expand your horizons and grow as a person.'}
];
Template.reviews.helpers({
  //add you helpers here
  "reviews_arr": () => {
      return reviews_arr;
    }
});

Template.reviews.events({

});

Template.reviews.onCreated(function () {
  //add your statement here
});

Template.reviews.onRendered(function () {
  //add your statement here
});

Template.reviews.onDestroyed(function () {
  //add your statement here
});

