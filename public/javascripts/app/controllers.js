Travis.controllers = SC.Object.create({

  repositories: SC.ArrayController.create({
    load: function() {
      this.set('content', Travis.Repository.latest());
    }
  }),

  repository: SC.SingleObjectController.create({
    tabs: SC.Object.create({
      active: null,
      current: SC.SingleObjectController.create(Travis.Helpers.Build, {
        name: 'current',
        contentBinding: 'Travis.controllers.repository.builds'
      }),

      builds: SC.ArrayController.create(Travis.Helpers.Build, {
        name: 'builds',
        contentBinding: 'Travis.controllers.repository.builds'
      }),

      build: SC.ObjectController.create(Travis.Helpers.Build, {
        name: 'build',
        content: null
      })
    }),

    load: function(params) {
      this.params = params;
      this.set('content', this.repository(params));
      if(this.params.id) {
        this.setPath('tabs.build.content', Travis.Build.find(this.params.id));
      }
      this.activateTab(params.tab);
    },

    repository: function(params) {
      if(params.owner && params.repository) {
        return Travis.Repository.findBy({ slug: params.owner + '/' + params.repository });
      } else {
        return Travis.Repository.latest();
      }
    },

    activateTab: function(tab) {
      this.invokeLast(function() {
        this.tabs.set('active', this.tabs[tab]);
        $('#repository .tabs > li').removeClass('active');
        $('#repository #tab_' + tab).addClass('active');
      });
    },

    repositoryObserver: function() {
      var repository = this.getPath('content.firstObject');
      if(repository) { repository.select(); }
    }.observes('content', 'tabs.active'),

    buildObserver: function() {
      this.getPath('active.content.parentId') ? $('#tab_parent').addClass('display') : $('#tab_parent').removeClass('display');
    }.observes('content', 'tabs.active') //('*active.content')
  }),

  jobs: SC.ArrayController.create({
    load: function() {
      this.set('content', Travis.Job.all());
    }
  }),

  workers: SC.ArrayController.create({
    load: function() {
      this.set('content', Travis.Worker.all());
    }
  })
});
