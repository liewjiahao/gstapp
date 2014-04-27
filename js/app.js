App = Ember.Application.create();

//App.ApplicationAdapter = DS.FixtureAdapter.extend();

// Routers

App.IndexRoute = Ember.Route.extend({
  beforeModel: function() {
    this.transitionTo('clients');
  }
});

App.Router.map(function() {
  this.route('clients' , {path: 'client'});
  this.route('client' , {path: 'client/:id'});
  /*this.resource('client', { path: '/client/:client_id' }, function(){
    this.route('home', {path: 'home'});
  });*/
});

App.ClientsRoute = Ember.Route.extend({
  model: function(){
    return this.store.find('client');
    //console.log(Ember.$.getJSON('/clients'));
    //return Ember.$.getJSON('/clients');
  }
});

App.ClientRoute = Ember.Route.extend({  
  model: function(params){
    return this.store.find('client', params.id);
  }

});


// Models

App.Client = DS.Model.extend({
  client_name: DS.attr('string'),
  year_end: DS.attr('number'),
  address_line_1: DS.attr('string'),
  address_line_2: DS.attr('string'),
  address_line_3: DS.attr('string')
});

// Controllers

App.ClientController = Ember.ObjectController.extend({
  actions: {
    generate_noc: function(client_name, year_end, address_line_1, address_line_2, address_line_3) {
      var noc_no = this.get('noc_no');
      var noc_date = this.get('noc_date');
      var noc_agent = this.get('noc_agent');
      var noc_desc_1 = this.get('noc_desc_1');
      var noc_amount_1 = this.get('noc_amount_1');
      var noc_desc_2 = this.get('noc_desc_2');
      var noc_amount_2 = this.get('noc_amount_2');
      var noc_desc_3 = this.get('noc_desc_3');
      var noc_amount_3 = this.get('noc_amount_3'); 
      var noc_desc_4 = this.get('noc_desc_4');
      var noc_amount_4 = this.get('noc_amount_4');
      var noc_desc_5 = this.get('noc_desc_5');
      var noc_amount_5 = this.get('noc_amount_5');
      var noc_desc_6 = this.get('noc_desc_6');
      var noc_amount_6 = this.get('noc_amount_6');                    
      var ajax_data = {client_name: client_name, 
        year_end: year_end, 
        address_line_1: address_line_1, 
        address_line_2: address_line_2, 
        address_line_3: address_line_3, 
        noc_no: noc_no, 
        noc_date: noc_date, 
        noc_agent: noc_agent, 
        noc_desc_1: noc_desc_1,         
        noc_amount_1: noc_amount_1, 
        noc_desc_2: noc_desc_2, 
        noc_amount_2: noc_amount_2, 
        noc_desc_3: noc_desc_3, 
        noc_amount_3: noc_amount_3, 
        noc_desc_4: noc_desc_4, 
        noc_amount_4: noc_amount_4, 
        noc_desc_5: noc_desc_5, 
        noc_amount_5: noc_amount_5, 
        noc_desc_6: noc_desc_6, 
        noc_amount_6: noc_amount_6 };
      Ember.$.ajax({
        type: 'post',
          url: '/noc',
          data: ajax_data,
          success: function(data){
            console.log(data);
            // alert(data);
            var filename = data;
            window.open(filename);      
          }
      });
    }
  }
});
